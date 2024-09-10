import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
})
export class ContactInfoComponent implements OnInit {
  inbox_id!: number;
  data: any;
  participants !:number
  currentChat: any;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.currenChat$.subscribe((chat: any) => {
      this.inbox_id = chat.inbox_id;
      this.currentChat = chat
      if (this.inbox_id) {
        this.getChatInfo();
      }
    });
  }

  getChatInfo() {
    if(this.currentChat.isgroup){
      this.userService.getChatInfo(this.inbox_id).subscribe((data:any) => {
         this.data = data[0];
         this.participants = this.data.group_members.length
       });
    }
    else{
     this.userService.getChatInfoChat(this.currentChat.contact_id , this.inbox_id).subscribe((data:any) => {
      this.data = data[0];
    });
    }
  }

  closeInfoPage() {
    this.userService.contactInfoVisible = false;
  }
}
