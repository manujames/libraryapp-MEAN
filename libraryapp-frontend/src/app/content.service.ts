import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  server_address:string = 'http://localhost:5000';
  constructor(private http:HttpClient) { }

  getBooks(){
    return this.http.get(`${this.server_address}/books`);
  }

  getAuthors(){
    return this.http.get(`${this.server_address}/authors`);
  }

  addBook(book: any){
    return this.http.post<any>(`${this.server_address}/books/add-book`,book);
  }

  addAuthor(author: any){
    return this.http.post<any>(`${this.server_address}/authors/add-author`,author);
  }

  getBook(id: any){
    return this.http.get(`${this.server_address}/books/edit/${id}`);
  }

  editBook(id: any,book: any){
    return this.http.put<any>(`${this.server_address}/books/edit/${id}`,book);
  }

  getAuthor(id: any){
    return this.http.get(`${this.server_address}/authors/edit/${id}`);
  }

  editAuthor(id: any,author: any){
    return this.http.put<any>(`${this.server_address}/authors/edit/${id}`,author);
  }

  deleteBook(id: any){
    return this.http.delete(`${this.server_address}/books/delete/${id}`);
  }

  deleteAuthor(id: any){
    return this.http.delete(`${this.server_address}/authors/delete/${id}`);
  }
}
