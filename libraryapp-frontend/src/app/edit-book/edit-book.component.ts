import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  MaxFileSize = 1*1024*1024;  //bytes
  book = {
    title:'',
    author:'',
    genre:'',
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
    this.getBook();
  }

  getBook(){
    this.state = 'fetch';
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    this.content.getBook(this.id)
    .subscribe(
      (data:any)=>{
        this.state = 'none';
        this.book.title = data.title;
        this.book.author = data.author;
        this.book.genre = data.genre;
        this.book.description = data.description;
        this.book.img = data.img;

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
    this.book.img.data = '';
    this.book.img.contentType = '';
    
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
          this.book.img.data = reader.result as string;
          this.book.img.contentType = file.type;
        };

        reader.readAsDataURL(file);
      }
    }
  }

  saveBook(){
    this.state = 'connecting';
    this.content.editBook(this.id, this.book)
    .subscribe(
      (data) =>{
        this.state = 'success';
        this.router.navigate(['/books']);
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
