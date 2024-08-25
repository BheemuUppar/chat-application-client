import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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

  constructor(private userSevrice: UserService) {
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

  formatDate(dateString: any) {
    if (dateString == null) {
      return '';
    }
    const inputDate = new Date(dateString);
    const today = new Date();

    const isSameDay = (date1: any, date2: any) =>
      date1.toDateString() === date2.toDateString();
    const isYesterday = (date: any) => {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      return isSameDay(date, yesterday);
    };
    const isWithinLastWeek = (date: any) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return date >= oneWeekAgo;
    };
    const isWithinSameYear = (date: any) =>
      date.getFullYear() === today.getFullYear();

    if (isSameDay(inputDate, today)) {
      return inputDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (isYesterday(inputDate)) {
      return 'Yesterday';
    } else if (isWithinLastWeek(inputDate)) {
      return inputDate.toLocaleDateString([], { weekday: 'long' });
    } else if (isWithinSameYear(inputDate)) {
      return inputDate.toLocaleDateString([], {
        day: 'numeric',
        month: 'short',
      });
    } else {
      return inputDate.toLocaleDateString([], {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  setCurrentChat(user: any) {
    this.currentChat = user;
    this.userSevrice.currentChat.next(this.currentChat);
  }
}
