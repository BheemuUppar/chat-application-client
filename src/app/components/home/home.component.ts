import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
interface User{
  id:string,
  name:string,
  email:string,
  mobile:string,
  profile_path:string | null
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit{
  currentUser :User | undefined;
 
  constructor(private router: Router, 
    private userService: UserService, 
  private socketService:SocketService
  ) {
    let id = localStorage.getItem('id');
    this.userService.getUserData(id).subscribe(()=>{
     this.currentUser =  this.userService.user
    });
    
  }
  incomingMessage:any 

  ngOnInit(): void {
    this.socketService.connect()

    this.socketService.on('onlineusers', (data)=>{
      console.log('online users ', data)
      this.userService.onlineUsers = data
    })
   

    this.socketService.on('onMsgRead', (data)=>{
      this.incomingMessage = data;
     
    })
   

  }
  messageReceived(){
    
  }
  
}
