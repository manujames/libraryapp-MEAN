import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.css']
})
export class AddAuthorComponent implements OnInit {

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
  imageSrc!: string;
  imgError = '';
  state = 'none';
  errorMsg = '';
  constructor(private content:ContentService, private router:Router) { }

  ngOnInit(): void {
    this.state = 'none';
    this.errorMsg = '';
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

  addAuthor(){
    this.state = 'connecting';
    this.content.addAuthor(this.author)
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
