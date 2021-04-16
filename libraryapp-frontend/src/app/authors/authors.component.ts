import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {

  authors: any;
  loaded = false;
  error = false;
  constructor(private content:ContentService, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.loaded = false;
    this.error = false;
    this.content.getAuthors()
    .subscribe(
      (authors:any)=>{
        for (let author of authors) {
          let imgSrc = `data:${author.img.contentType};base64, ${this.bufferToBase64(author.img.data.data)}`;
          author.thumbnail = this.sanitizer.bypassSecurityTrustUrl(imgSrc);
        }
        this.loaded = true;
        this.authors = authors;
      },
      (error)=>{
        console.log(error);
        this.loaded = true;
        this.error = true;
      }
    );
  }

  bufferToBase64(buffer:any) {
    const base64String = btoa(new Uint8Array(buffer).reduce((data, byte)=> {
      return data + String.fromCharCode(byte);
    },''));
    return base64String;
  }

}
