import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: ''
  };

  loginState = 'none';
  errorMsg = '';
  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()){
      this.router.navigate(['/']);
    }
    this.resetForm();
  }

  resetForm(){
    this.user = {
      email: '',
      password: ''
    };
    this.loginState = 'none';
    this.errorMsg = '';
  }

  login(){
    this.loginState = 'connecting';
    this.auth.login(this.user)
    .subscribe(
      data =>{
        this.loginState = 'success';
        localStorage.setItem('token',data.token);
        this.resetForm();
        this.router.navigate(['/']);
      },
      error =>{
        this.loginState = 'error'
        if(error.status === 401){
          this.errorMsg = error.error;
        }
        else{
          this.errorMsg = 'Sorry! Something went wrong.'
          console.log(error);
        }
      }
    );
  }

}
