import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { BooksComponent } from './books/books.component';
import { ContentService } from './content.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorsComponent } from './authors/authors.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './signup/signup.component';
import { AddBookComponent } from './add-book/add-book.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AddAuthorComponent } from './add-author/add-author.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { EditAuthorComponent } from './edit-author/edit-author.component';
import { DeleteBookComponent } from './delete-book/delete-book.component';
import { DeleteAuthorComponent } from './delete-author/delete-author.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    BooksComponent,
    AuthorsComponent,
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    AddBookComponent,
    AccessDeniedComponent,
    AddAuthorComponent,
    EditBookComponent,
    EditAuthorComponent,
    DeleteBookComponent,
    DeleteAuthorComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ContentService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
