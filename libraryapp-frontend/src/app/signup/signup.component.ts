import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user = {
    fname: '',
    sname: '',
    email: '',
    password: ''
  };

  signupForm = new FormGroup(
    {
      fname: new FormControl('',Validators.required),
      sname: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9.%+]+@[a-z0-9.-]+\.[a-z]{2,4}')]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        this.pwdContainsNumber,
        this.pwdContainsLowCase,
        this.pwdContainsUpCase,
        this.pwdContainsSpecialChar
      ]),
      repeatPassword: new FormControl('',Validators.required)
    },this.pwdMatch
  )

  pwdMatch(form:any): ValidationErrors | null{
    if(form.controls.password.value !== form.controls.repeatPassword.value){
      return {pwdMissMatch:true};
    }
    else{
      return null;
    }
  }

  pwdContainsNumber(control:AbstractControl): ValidationErrors | null{
    if(control.value.match('(.*[0-9].*)') === null){
      return {noNumeric:true};
    }
    else{
      return null;
    }
  }

  pwdContainsLowCase(control:AbstractControl): ValidationErrors | null{
    if(control.value.match('(.*[a-z].*)') === null){
      return {noLowerCase:true};
    }
    else{
      return null;
    }
  }

  pwdContainsUpCase(control:AbstractControl): ValidationErrors | null{
    if(control.value.match('(.*[A-Z].*)') === null){
      return {noUpperCase:true};
    }
    else{
      return null;
    }
  }

  pwdContainsSpecialChar(control:AbstractControl): ValidationErrors | null{
    if(control.value.match('(.*[!-/:-@[-`{-~].*)') === null){
      return {noSpecialChar:true};
    }
    else{
      return null;
    }
  }

  get signUpFormControls(){
    return this.signupForm.controls;
  }

  signupState = 'none';
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
      password: '',
      fname: '',
      sname: ''
    };
    this.signupState = 'none';
    this.errorMsg = '';
  }

  signup(){
    this.signupState = 'connecting';
    this.user.fname = this.signupForm.controls.fname.value;
    this.user.sname = this.signupForm.controls.sname.value;
    this.user.email = this.signupForm.controls.email.value;
    this.user.password = this.signupForm.controls.password.value;
    console.log(this.user);
    this.auth.signup(this.user)
    .subscribe(
      data =>{
        this.signupState = 'success';
        localStorage.setItem('token',data.token);
        this.resetForm();
        this.router.navigate(['/']);
      },
      error =>{
        this.signupState = 'error'
        if(error.status === 409){
          this.errorMsg = error.error;
        }
        else{
          this.errorMsg = 'Sorry! Something went wrong.'
          console.log(error);
        }
      }
    )
  }

}
