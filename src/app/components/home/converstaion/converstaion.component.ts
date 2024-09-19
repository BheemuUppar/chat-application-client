import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-converstaion',
  templateUrl: './converstaion.component.html',
  styleUrls: ['./converstaion.component.css'],
})
export class ConverstaionComponent
  implements AfterViewInit, OnInit, OnChanges, AfterContentInit, OnDestroy
{
  currentChat: any;
  user: any;
  message_text = '';
  @Input() messages: any = [];
  imageLink: string = '';
  messageFiles: File[] = [];
  convertedFiles: any = [];
  @Input() isSmallScreen: boolean = false;
  videoLink: unknown;

  constructor(
    public userService: UserService,
    private socketService: SocketService,
    public dateService: DateService,
    public utilService: UtilService
  ) {}

  ngAfterContentInit(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    this.userService.currenChat$.subscribe((user: any) => {
      if( this.currentChat == undefined ||  this.currentChat.contact_id != user.contact_id || this.currentChat.unread_count > 0){
        console.log('contact updated')
        this.currentChat = user;
        this.resetSelectedFiles();
        this.getMessages();
        this.scrollToBottom();
      }
    });
    this.userService.readNewMessage$.subscribe(() => {
      console.log('mesage subscribe..');
      if( this.currentChat  &&  this.currentChat.unread_count > 0){

        this.getMessages();
        this.scrollToBottom();
      }
    });

    // Listening for 'sent' event (for sender confirmation)
    this.socketService.on('sent', (data) => {
      this.message_text = '';
      this.messages = this.getMessages();
      this.scrollToBottom();
      this.utilService.playMessageSent()
    });
    this.socketService.on('msgDeleted', (data) => {
      this.getMessages();
    });
    this.socketService.on('failedToDeleteMessage', (data) => {
      console.log('failed to delete message ');
    });

    // Scroll to the bottom of the messages div
    this.scrollToBottom();
  }

  @Input() msgUpdate: any;
  ngOnChanges(changes: SimpleChanges): void {
    if(this.currentChat  &&  this.currentChat.unread_count > 0){
      this.getMessages();
    }
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.code == 'Enter') {
      this.sendMessage();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      let div = document.getElementById('messageBody');
      if (div) {
        div.scrollTo(0, div.scrollHeight);
      }
    }, 0);
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  getMessages() {
    if (this.currentChat ) {
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
    if (this.convertedFiles.length > 0) {
      this.sendMedia();
      return;
    }
    console.log('after sending media')
    if (this.message_text.trim() == '') {
      this.utilService.openSnackBar('Nothing to send')
      this.message_text = '';
      return;
    }

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
    this.resetSelectedFiles();
  }

  readMessage() {
    // sender id != my id
    this.socketService.emit('read', {
      user_id: this.userService.user.user_id,
      inbox_id: this.currentChat.inbox_id,
    });
  }

  getChatProfile(id: number) {
    if (id == this.user.user_id) {
      return this.user.profile_path;
    }
    if (this.currentChat.isgroup == false) {
      return this.currentChat.profile_path;
    }
    let profile = '';
    for (let member of this.currentChat.group_members) {
      if (member.id == id) {
        profile = member.profile_path;
        break;
      }
    }
    return profile;
  }

  getOnlineStatusClass(id: number) {
    if (id == this.currentChat.contact_id && this.currentChat.isgroup) {
      return '';
    }
    return this.userService.isOnline(id) ? 'online' : 'offline';
  }

  async fileUpload() {
    try {
      let files: any[] = await this.getInputFiles();
      console.log(files); // This will log the selected files
      this.messageFiles = files;
      for (let i = 0; i < files.length; i++) {
        let buffer = await this.getArrayBufferFromFile(files[i]);
        this.convertedFiles.push(buffer);
      }
      if (this.messageFiles[0].type == 'image/png') {
        await this.getImageLink(this.messageFiles[0]);
      }
      if (this.messageFiles[0].type.startsWith('video/')) {
        this.videoLink = await this.getImageLink(this.messageFiles[0]);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }

  sendMedia() {
    let payload: any = {
      files_data: this.convertedFiles,
      message_text: this.message_text,
      sender_id: this.user.user_id,
    };

    console.log(JSON.stringify(payload))

    if (this.currentChat.isgroup == true) {
      payload['inbox_id'] = this.currentChat.inbox_id;
      this.socketService.emit('sendToGroup', payload);
    } else {
      payload['receiver_id'] = this.currentChat.contact_id;
      this.socketService.emit('sendMessage', payload);
    }
    this.resetSelectedFiles();
  }

  getInputFiles(): Promise<File[]> {
    return new Promise((resolve, reject) => {
      let input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();

      // Event listener for the file selection
      input.addEventListener('change', (event: any) => {
        const files = event.target.files;

        if (files && files.length > 0) {
          this.convertedFiles = [];
          resolve(files); // Resolving with the selected files
        } else {
          reject('No files selected'); // Handling the case when no files are selected
        }
      });

      // Error handling for file selection
      input.addEventListener('error', () => {
        reject('Error selecting file');
      });
    });
  }

  getArrayBufferFromFile(file: File) {
    return new Promise((resolve, reject) => {
      // Read file as ArrayBuffer
      const reader = new FileReader();
      reader.onload = function (event: any) {
        const arrayBuffer = event.target.result;
        const fileName = file.name;

        // Send file data to the server
        let fileBuffer = new Uint8Array(arrayBuffer); // Convert ArrayBuffer to Uint8Array
        if (fileBuffer) {
          resolve({ name: file.name, fileData: fileBuffer }); // Resolving with the selected files
        } else {
          reject('Error'); // Handling the case when no files are selected
        }
      };

      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    });
  }

  ngOnDestroy(): void {}

  resetSelectedFiles() {
    this.messageFiles = [];
    (this.message_text = ''), (this.convertedFiles = []);
    this.imageLink = '';
    this.videoLink = undefined;
  }

  getImageLink(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Define what happens when the file is loaded
      reader.onload = (e: any) => {
        // Resolve the promise with the data URL of the loaded image
        if(!file.type.startsWith('video/')){
          this.imageLink = e.target.result;
        }

        resolve(e.target.result);
      };

      // Handle file reading errors
      reader.onerror = function () {
        reject('Error reading file');
      };

      // Read the file as a data URL (base64 encoded)
      reader.readAsDataURL(file);
    });
  }

  showContactInfo() {
    this.userService.contactInfoVisible = true;
    this.changeView('info');
  }
  @Output() viewChange = new EventEmitter<
    'sidebar' | 'conversation' | 'info'
  >();
  changeView(view: 'sidebar' | 'conversation' | 'info') {
    this.viewChange.emit(view);
    if (view == 'sidebar') {
      this.userService.currentChat.next(undefined);
    }
  }

  deleteMessage(msg: any) {
    this.socketService.emit('deleteMessage', {
      message_id: msg.message_id,
      inbox_id: msg.inbox_id,
    });
  }

  
}
