import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnChanges {
  user: any;
  searchText!: string;
  users: any;

  myChatUsers: any[] = [];
  currentChat: any;
  inbox: any[] = [];
  @Input() onMessageReceive:any

  constructor(private userSevrice: UserService, public dateService:DateService) {
    this.user = this.userSevrice.user;
    this.getInbox()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getInbox()
  }

  getInbox(){
    this.userSevrice.getAllInbox().subscribe((res: any) => {
      this.myChatUsers = res;
    });
  }

  fetchUsers() {
    if (this.searchText != '' || this.searchText) {
      this.userSevrice.searchUsers(this.searchText).subscribe({
        next: (res: any) => {
          this.users = res.data;
          console.log(res.data);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      this.searchText = '';
      this.users = undefined;
    }
  }

  startChat(user: any) {
    console.log(user);
    this.myChatUsers.unshift(user);
    this.searchText = '';
    this.users = undefined;
    this.currentChat = user;
    this.userSevrice.currentChat.next(this.currentChat);
  }

  

  setCurrentChat(user: any) {
    this.currentChat = user;
    this.userSevrice.currentChat.next(this.currentChat);
  }
}
