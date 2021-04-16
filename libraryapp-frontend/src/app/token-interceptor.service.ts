import { HttpInterceptor } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector:Injector) { }
  intercept(req:any,next:any){
    let auth = this.injector.get(AuthService);
    let tokenizedRequest = req.clone(
      {
        setHeaders:{
          authorization:`Bearer ${auth.getToken()}`
        }
      }
    );
    return next.handle(tokenizedRequest);
  }
}
