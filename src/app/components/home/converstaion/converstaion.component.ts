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
  messages: any = [];
  constructor(private userService:UserService, private socketService:SocketService){

  }

  ngOnInit(): void {
    this.user = this.userService.user
      this.userService.currenChat$.subscribe((user:any)=>{
        this.currentChat = user;
        this.getMessages()
        
      });
      this.socketService.on('sent', ()=>{
        this.message_text = '';
        alert("message sent")
      })
  }
  ngAfterViewInit(): void {
    let div = document.getElementById('messages');
    if(div){
      div.scrollTo(0, div.scrollHeight)
    }
  }

  getMessages(){
    this.userService.getAllMessages(this.currentChat.inbox_id).subscribe({
      next:(res:any)=>{
        this.messages = res
      },
      error:()=>{
        this.messages = []
      }
    })
  }

  sendMessage(){
    let payload  = {
      sender_id:this.user.user_id,
      receiver_id:this.currentChat.contact_id,
      message_text : this.message_text
    }
    this.socketService.emit('sendMessage', payload)
    console.log(payload)
  }

}
