import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  server_address:string = 'http://localhost:5000';
  constructor(private http:HttpClient) { }

  login(user: any){
    return this.http.post<any>(`${this.server_address}/accounts/login`,user);
  }

  isLoggedIn(){
    // Return boolean: Token present or not.
    return !!localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');  
  }

  signup(user: any){
    return this.http.post<any>(`${this.server_address}/accounts/signup`,user);
  }
}
