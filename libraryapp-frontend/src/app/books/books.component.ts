import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books: any;
  loaded = false;
  error = false;
  constructor(
    private content:ContentService, 
    private sanitizer:DomSanitizer
    ) { }

  ngOnInit(): void {
    this.loaded = false;
    this.error = false;
    this.content.getBooks()
    .subscribe(
      (books:any)=>{
        for (let book of books) {
          let imgSrc = `data:${book.img.contentType};base64, ${this.bufferToBase64(book.img.data.data)}`;
          book.thumbnail = this.sanitizer.bypassSecurityTrustUrl(imgSrc);
        }
        this.loaded = true;
        this.books = books;
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
