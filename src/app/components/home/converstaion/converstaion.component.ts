import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-converstaion',
  templateUrl: './converstaion.component.html',
  styleUrls: ['./converstaion.component.css'],
})
export class ConverstaionComponent
  implements AfterViewInit, OnInit, OnChanges, AfterContentInit
{
  currentChat: any;
  user: any;
  message_text = '';
  @Input() messages: any = [];
  constructor(
    public userService: UserService,
    private socketService: SocketService,
    public dateService: DateService
  ) {}
  ngAfterContentInit(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    this.userService.currenChat$.subscribe((user: any) => {
      this.currentChat = user;
      this.getMessages();
    });

    // Listening for 'sent' event (for sender confirmation)
    this.socketService.on('sent', (data) => {
      this.message_text = '';
      console.log('Message sent event received');
      this.messages = data;
      console.log('data ', data);
      this.scrollToBottom();
    });

    // Listening for 'messageReceviced' event (for receiver notification)

    // Scroll to the bottom of the messages div
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.userService.currenChat$.subscribe((user: any) => {
      if (this.currentChat && this.currentChat.contact_id == user.contact_id) {
        this.currentChat = user;
        this.getMessages();
        this.scrollToBottom();
      }
    });
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.code == 'Enter') {
      this.sendMessage();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      let div = document.getElementById('messages');
      if (div) {
        console.log('div height ', div.scrollHeight);
        div.scrollTo(0, div.scrollHeight);
      }
    }, 0);
  }

  // updateMessage(messages:any){
  //     if(messages.length != 0){
  //       if(messages[0].sender_id == this.currentChat.user_id){
  //         this.messages = messages
  //       }
  //     }
  //     else{
  //       this.messages = []
  //     }
  // }
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  getMessages() {
    if (this.currentChat) {
      this.userService.getAllMessages(this.currentChat.inbox_id).subscribe({
        next: async (res: any) => {
          this.messages = await res;
          this.scrollToBottom();
          this.readMessage();
        },
        error: (err) => {
          console.log(err);
          this.messages = [];
        },
      });
    }
  }

  sendMessage() {
    if (!this.currentChat.isgroup) {
      let payload = {
        sender_id: this.user.user_id,
        receiver_id: this.currentChat.contact_id,
        message_text: this.message_text,
      };
      this.socketService.emit('sendMessage', payload);
      return;
    }
    if (this.currentChat.isgroup == true) {
      let payload = {
        inbox_id: this.currentChat.inbox_id,
        sender_id: this.user.user_id,
        message_text: this.message_text,
      };
      this.socketService.emit('sendToGroup', payload);
    }
  }

  readMessage() {
    // sender id != my id
    this.socketService.emit('read', {
      user_id: this.userService.user.user_id,
      inbox_id: this.currentChat.inbox_id,
    });
  }
}
