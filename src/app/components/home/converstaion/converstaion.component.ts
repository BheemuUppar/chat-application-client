import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-converstaion',
  templateUrl: './converstaion.component.html',
  styleUrls: ['./converstaion.component.css']
})
export class ConverstaionComponent implements AfterViewInit, OnInit {
  currentChat: any;
  user:any
  constructor(private userService:UserService){

  }

  ngOnInit(): void {
    this.user = this.userService.user
      this.userService.currenChat$.subscribe((user:any)=>{
        this.currentChat = user;
        
      })
  }
  ngAfterViewInit(): void {
    let div = document.getElementById('messages');
    if(div){
      div.scrollTo(0, div.scrollHeight)
    }
  }

}
