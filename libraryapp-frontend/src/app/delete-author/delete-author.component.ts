import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-delete-author',
  templateUrl: './delete-author.component.html',
  styleUrls: ['./delete-author.component.css']
})
export class DeleteAuthorComponent implements OnInit {

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

  deleteAuthor(){
    this.state = 'connecting';
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    this.content.deleteAuthor(this.id)
    .subscribe(
      (data)=>{
        this.state = 'success';
        this.router.navigate(['/authors']);
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
