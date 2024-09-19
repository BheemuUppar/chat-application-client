import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { DateService } from 'src/app/services/date.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnChanges, OnInit {
  user: any;
  searchText!: string;
  searchTextForGroup!: string;
  groupName!: string;
  groupImage: any;
  groupImageFile: any;
  users: any;
  currentPage: string | undefined = undefined;
  myChatUsers: any[] = [];
  currentChat: any;
  inbox: any[] = [];
  @Input() onMessageReceive: any;

  constructor(
    public userSevrice: UserService,
    public dateService: DateService,
    private socketService: SocketService,
    private router: Router,
    private utilService:UtilService
  ) {
    this.user = this.userSevrice.user;
    this.getInbox();
  }

  ngOnInit(): void {
    this.socketService.on('sent', (data) => {
      this.getInbox();
    });
    this.socketService.on('onMsgRead', (data) => {
      this.getInbox();
      
    });
    this.socketService.on('messageReceviced', (messages) => {
 //  this.incomingMessage = messages;
      this.getInbox();
      this.utilService.playNotificationSound()
    });

    this.socketService.on('onlineusers', (data) => {
      this.getInbox();
    });
    this.socketService.on('groupAdded', (data) => {
      this.getInbox();
    });
    this.userSevrice.currenChat$.subscribe((user:any)=>{
      this.currentChat = user
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.getInbox()
  }

  getInbox() {
    this.userSevrice.getAllInbox().subscribe((res: any) => {
      this.myChatUsers = res;
      for(let user of this.myChatUsers){
        if( this.currentChat &&  user.contact_id == this.currentChat.contact_id){
          this.currentChat = user;
          this.userSevrice.currentChat.next(this.currentChat);
          break
        }
      }
     
      this.readCurrentChatMessage();
    });
  }

  @Output() markAsRead = new EventEmitter();
  readCurrentChatMessage() {
    for (let user of this.myChatUsers) {
      if ( this.currentChat &&  user.contact_id == this.currentChat.contact_id && user.unread_count > 0
      ) {
        this.markAsRead.emit(this.currentChat);
        this.utilService.playIncomingMessage()
        break;
      }
    }
  }

  fetchUsers() {
    if (this.searchText != '' || this.searchText) {
      this.userSevrice.searchUsers(this.searchText).subscribe({
        next: (res: any) => {
          this.users = res.data.filter((user: any) => {
            return user.contact_id != this.userSevrice.user.user_id;
          });
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
    let isExist = -1;
    // check if user exist in inbox already
    for (let i = 0; i < this.myChatUsers.length; i++) {
      if (this.myChatUsers[i].contact_id == user.contact_id) {
        isExist = i;
        break; // break if you found in inbox 
      }
    }
    if (isExist >= 0) {
      let temp = this.myChatUsers[isExist];
      this.myChatUsers.splice(isExist, 1);
      this.myChatUsers.unshift(temp);
      this.currentChat = this.myChatUsers[0];
      this.searchText = '';
      this.users = undefined;
    } else {
      this.myChatUsers.unshift(user);
      this.currentChat = user;
    }
   
    this.userSevrice.currentChat.next(this.currentChat);
    this.currentPage = undefined;
  }

  selectedUsers: number[] = [];
  onSelection(event: MatCheckboxChange, id: number) {
    if (event.checked) {
      this.selectedUsers.push(id);
    } else {
      let index = this.selectedUsers.indexOf(id);
      this.selectedUsers.splice(index, 1);
    }
  }

  isSelectionMode: boolean = false;
  @Output() viewChange = new EventEmitter<
    'sidebar' | 'conversation' | 'info'
  >();
  setCurrentChat(user: any) {
    this.currentChat = user;
    this.userSevrice.currentChat.next(this.currentChat);
    this.viewChange.emit('conversation');
  }

  createGroup() {
    const formData = new FormData();

    // Append only the file to FormData
    formData.append('myUserId', String(this.userSevrice.user.user_id));
    formData.append('groupName', String(this.groupName));
    formData.append('groupMembers', String(JSON.stringify(this.selectedUsers)));
    formData.append('groupProfileImage', this.groupImageFile);
    // this.socketService.emit('createGroup', data);
    this.userSevrice.createGroup(formData).subscribe({
      next: (res) => {
        this.socketService.emit('groupCreated', this.selectedUsers);
        this.utilService.openSnackBar("Group Created");
        this.goTo(undefined);
        this.getInbox()
      },
    });
  }

  setSelectionMode() {
    this.isSelectionMode = !this.isSelectionMode;
    if (this.isSelectionMode == false) {
      this.selectedUsers = [];
    }
  }
  goTo(value: string | undefined) {
    this.currentPage = value;
  }

  next() {
    if (this.selectedUsers.length == 0) {
      this.utilService.openSnackBar('Select users to proceed');
      return;
    }
    this.goTo('saveGroupInfo');
  }

  onGroupProfileUpload(event: any) {
    let files = event.target.files;
    if (files.length === 0) return;
    this.groupImageFile = files[0];
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    // this.imagePath = files;

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.groupImage = reader.result;
    };
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }
  getOnlineStatusClass(contact: any) {
    if (contact.isgroup) {
      return '';
    }
    return this.userSevrice.isOnline(contact.contact_id) ? 'online' : 'offline';
  }

  changeProfile(){
    console.log("change profile clicked...")
  }

  triggerFileInput() {
    const fileInput = document.getElementById('group_profile') as HTMLInputElement;
    fileInput.click();
  }
  chatSearchText:string = ''
 getFilteredChats():any[]{
 return this.myChatUsers.filter((user:any)=>{
    return user.contact_name.toLowerCase().includes(this.chatSearchText.toLowerCase())
  })
 }
}
