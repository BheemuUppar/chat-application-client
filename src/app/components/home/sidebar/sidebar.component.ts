import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  user: any;
  searchText!: string;
  users: any;

  myChatUsers: any[] = [];
  currentChat: any;

  constructor(private userSevrice: UserService) {
    this.user = this.userSevrice.user;
  }

  fetchUsers() {
    if (this.searchText != '' || this.searchText) {
      this.userSevrice.searchUsers(this.searchText).subscribe({
        next: (res: any) => {
          this.users = res.data;
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
    console.log(user)
    this.myChatUsers.unshift(user)
    this.currentChat = user;
    this.searchText = '';
    this.users = undefined;
    
  }
}
