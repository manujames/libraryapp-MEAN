import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AddAuthorComponent } from './add-author/add-author.component';
import { AddBookComponent } from './add-book/add-book.component';
import { AuthGuard } from './auth.guard';
import { AuthorsComponent } from './authors/authors.component';
import { BooksComponent } from './books/books.component';
import { DeleteAuthorComponent } from './delete-author/delete-author.component';
import { DeleteBookComponent } from './delete-book/delete-book.component';
import { EditAuthorComponent } from './edit-author/edit-author.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'books',component:BooksComponent},
  {path:'authors',component:AuthorsComponent},
  {path:'login',component:LoginComponent},
  {path:'logout',component:LogoutComponent},
  {path:'signup',component:SignupComponent},
  {
    path:'add-book',
    canActivate:[AuthGuard],
    component:AddBookComponent
  },
  {
    path:'add-author',
    canActivate:[AuthGuard],
    component:AddAuthorComponent
  },
  {
    path:'edit-book/:id',
    canActivate:[AuthGuard],
    component:EditBookComponent
  },
  {
    path:'edit-author/:id',
    canActivate:[AuthGuard],
    component:EditAuthorComponent
  },
  {
    path:'delete-book/:id',
    canActivate:[AuthGuard],
    component:DeleteBookComponent
  },
  {
    path:'delete-author/:id',
    canActivate:[AuthGuard],
    component:DeleteAuthorComponent
  },
  {path:'access-denied',component:AccessDeniedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
