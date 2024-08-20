import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-converstaion',
  templateUrl: './converstaion.component.html',
  styleUrls: ['./converstaion.component.css']
})
export class ConverstaionComponent implements AfterViewInit, OnInit {
  currentChat: any;
  user:any
  message_text = ''
  constructor(private userService:UserService, private socketService:SocketService){

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

  sendMessage(){
    let payload  = {
      sender_id:this.user.user_id,
      receiver_id:this.currentChat.user_id,
      message_text : this.message_text
    }
    this.socketService.emit('sendMessage', payload)
    console.log(payload)
  }

}
