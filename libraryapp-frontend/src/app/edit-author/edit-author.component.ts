import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-edit-author',
  templateUrl: './edit-author.component.html',
  styleUrls: ['./edit-author.component.css']
})
export class EditAuthorComponent implements OnInit {

  MaxFileSize = 1*1024*1024;  //bytes
  author = {
    name:'',
    books:'',
    description:'',
    img:{
      data:'',
      contentType:''
    }
  }
  imageSrc!: any;
  imgError = '';
  state = 'none';
  errorMsg = '';
  disableForm: boolean = false;
  id!: string | null;
  constructor(
    private content:ContentService, 
    private router:Router, 
    private activeRoute: ActivatedRoute,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
    this.state = 'none';
    this.errorMsg = '';
    this.getAuthor();
  }

  getAuthor(){
    this.state = 'fetch';
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    this.content.getAuthor(this.id)
    .subscribe(
      (data:any)=>{
        this.state = 'none';
        this.author.name = data.name;
        this.author.books = data.books;
        this.author.description = data.description;
        this.author.img = data.img;

        this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(
          `data:${data.img.contentType};base64, ${this.bufferToBase64(data.img.data.data)}`
        );
      },
      (error)=>{
        this.state = 'error'
        console.log(error);
        this.disableForm = true;
        if(error.status === 401){
          this.errorMsg = 'You are unautherized to perform this action. Login with valid user credentials.';
          localStorage.removeItem('token');
        }
        else if(error.status === 404){
          this.errorMsg = 'Could not find the requested item';
        }
        else{
          this.errorMsg = 'Sorry! Something went wrong.'
        }
      }
    )
  }

  bufferToBase64(buffer:any) {
    const base64String = btoa(new Uint8Array(buffer).reduce((data, byte)=> {
      return data + String.fromCharCode(byte);
    },''));
    return base64String;
  }

  onFileChange(event:any) {
    const reader = new FileReader();
    this.imageSrc = '';
    this.imgError = '';
    this.author.img.data = '';
    this.author.img.contentType = '';
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if(file.size>this.MaxFileSize){
        this.imgError = 'Selected file is larger than 1 MB. Select a smaller image.';
      }
      else if(file.type.split('/')[0] !== 'image'){
        this.imgError = 'Selected file is not an image. Please select an image file.'
      }
      else{
        reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.author.img.data = reader.result as string;
          this.author.img.contentType = file.type;
        };

        reader.readAsDataURL(file);
      }
    }
  }

  saveAuthor(){
    this.state = 'connecting';
    this.content.editAuthor(this.id,this.author)
    .subscribe(
      (data) =>{
        this.state = 'success';
        this.router.navigate(['/authors']);
      },
      (error) =>{
        this.state = 'error'
        console.log(error);
        if(error.status === 401){
          this.errorMsg = 'You are unautherized to perform this action. Login with valid user credentials.';
          localStorage.removeItem('token');
        }
        else{
          this.errorMsg = 'Sorry! Something went wrong.'
        }
      }
    );
  }

}
