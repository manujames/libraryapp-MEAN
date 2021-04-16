import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-delete-book',
  templateUrl: './delete-book.component.html',
  styleUrls: ['./delete-book.component.css']
})
export class DeleteBookComponent implements OnInit {

  state = 'none';
  errorMsg = '';
  id!: string | null;
  constructor(
    private content:ContentService,
    private router:Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.state = 'none';
    this.errorMsg = '';
  }

  deleteBook(){
    this.state = 'connecting';
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    this.content.deleteBook(this.id)
    .subscribe(
      (data)=>{
        this.state = 'success';
        this.router.navigate(['/books']);
      },
      (error)=>{
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
