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
import { DateService } from 'src/app/services/date.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

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
  groupImage :any;
  groupImageFile:any
  users: any;
  currentPage: string | undefined = undefined;
  myChatUsers: any[] = [];
  currentChat: any;
  inbox: any[] = [];
  @Input() onMessageReceive: any;

  constructor(
    public userSevrice: UserService,
    public dateService: DateService,
    private socketService: SocketService
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
      console.log('Message received event triggered', messages);
      //  this.incomingMessage = messages;
      this.getInbox();
    });

    this.socketService.on('onlineusers', (data) => {
      console.log('online users ', data);
      this.getInbox();
    });
    this.socketService.on('groupAdded', (data)=>{
      console.log('group added', data)
      this.getInbox()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.getInbox()
  }

  getInbox() {
    this.userSevrice.getAllInbox().subscribe((res: any) => {
      this.myChatUsers = res;
      this.readCurrentChatMessage()
      
    });
  }

  
  readCurrentChatMessage(){
    for(let user of this.myChatUsers){
      if(user.contact_id == this.currentChat.contact_id && user.unread_count > 0){
        this.userSevrice.currentChat.next(this.currentChat);
        break
      }
    }
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
    let isExist = -1;
    for (let i = 0; i < this.myChatUsers.length; i++) {
      if (this.myChatUsers[i].contact_id == user.contact_id) {
        isExist = i;
        break;
      }
    }
    if (isExist >= 0) {
      let temp = this.myChatUsers[isExist];
      this.myChatUsers.splice(isExist, 1);
      this.myChatUsers.unshift(user);
    } else {
      this.myChatUsers.unshift(user);
    }

    this.searchText = '';
    this.users = undefined;
    this.currentChat = user;
    this.userSevrice.currentChat.next(this.currentChat);
    this.currentPage = undefined
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
  setCurrentChat(user: any) {
    if (this.isSelectionMode == false) {
      this.currentChat = user;
      this.userSevrice.currentChat.next(this.currentChat);
    }
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
      next:(res)=>{
          this.socketService.emit('groupCreated', this.selectedUsers)
          console.log("after group create")
      }
    })
  }

  setSelectionMode() {
    this.isSelectionMode = !this.isSelectionMode;
    if (this.isSelectionMode == false) {
      this.selectedUsers = [];
    }
  }
  goTo(value:string|undefined){
    this.currentPage = value;

  }

  next(){
    if(this.selectedUsers.length == 0){
      alert("Select users to proceed")
      return 
    };
    this.goTo('saveGroupInfo')
  }

  onGroupProfileUpload(event:any){
    let files = event.target.files
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
}
