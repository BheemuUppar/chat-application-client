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
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.currenChat$.subscribe((chat: any) => {
      this.inbox_id = chat.inbox_id;
      if (this.inbox_id) {
        this.getChatInfo();
      }
    });
  }

  getChatInfo() {
    this.userService.getChatInfo(this.inbox_id).subscribe((data:any) => {
      this.data = data[0];
      this.participants = this.data.group_members.length

    });
  }

  closeInfoPage() {
    this.userService.contactInfoVisible = false;
  }
}
