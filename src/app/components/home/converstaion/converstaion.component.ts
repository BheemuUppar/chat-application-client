import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
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
  implements AfterViewInit, OnInit, OnChanges, AfterContentInit, OnDestroy
{
  currentChat: any;
  user: any;
  message_text = '';
  @Input() messages: any = [];
  imageLink: string = '';
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
      this.resetSelectedFiles();
      this.getMessages();
      this.scrollToBottom();
    });
    this.userService.readNewMessage$.subscribe(() => {
      console.log('mesage subscribe..');
      this.getMessages();
      this.scrollToBottom();
    });

    // Listening for 'sent' event (for sender confirmation)
    this.socketService.on('sent', (data) => {
      this.message_text = '';
      this.messages = this.getMessages();
      this.scrollToBottom();
    });

    // Listening for 'messageReceviced' event (for receiver notification)

    // Scroll to the bottom of the messages div
    this.scrollToBottom();
  }
  @Input() msgUpdate: any;
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changed.. ', changes);

    // console.log(changes)
    // this.userService.currenChat$.subscribe((user: any) => {
    //   if (this.currentChat && this.currentChat.contact_id == user.contact_id) {
    //     this.currentChat = user;
    this.getMessages();

    //   }
    // });
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
    if (this.convertedFiles.length > 0) {
      this.sendMedia();
      return;
    }
    if (this.message_text.trim() == '') {
      alert('Nothing to send');
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

  messageFiles: File[] = [];
  convertedFiles: any = [];
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
      // files.forEach(async (file:File)=>{

      //   let buffer =await  this.getArrayBufferFromFile(files[0]);
      //   this.convertedFiles.push(buffer)
      // })

      console.log(this.convertedFiles);
      if (files.length == 0) {
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
    if (this.currentChat.isgroup == true) {
      (payload['inbox_id'] = this.currentChat.inbox_id),
        this.socketService.emit('sendToGroup', payload);
    } else {
      (payload['receiver_id'] = this.currentChat.contact_id),
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

  getFileType(msg: any) {
    if (!msg.message_file) {
      return '';
    }
    let path: string = msg.message_file;
    if (path.endsWith('.pdf')) {
      return 'pdf';
    }
    if (path.endsWith('.jpg') || path.endsWith('png')) {
      return 'image';
    }

    return '';
  }

  resetSelectedFiles() {
    this.messageFiles = [];
    (this.message_text = ''), (this.convertedFiles = []);
    this.imageLink = '';
  }

  getImageLink(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Define what happens when the file is loaded
      reader.onload = (e: any) => {
        // Resolve the promise with the data URL of the loaded image
        this.imageLink = e.target.result;

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

  readBuffer(arrayBuffer: ArrayBuffer) {
    // const blob = new Blob([arrayBuffer], { type: file.type });
    // const url = URL.createObjectURL(blob);
  }

  downloadFile(base64String: string, fileName: string, fileType: string) {
    // Remove any headers, if present (e.g., "data:application/pdf;base64,")
    const cleanedBase64 = base64String.split(',')[1] || base64String;

    try {
      // Decode the base64 string to binary data
      const byteCharacters = atob(cleanedBase64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType });

      // Create a link element and set the href to the blob URL
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;

      // Append the link to the body, trigger the click, and remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error decoding base64 string:', error);
      alert(
        'Failed to decode the base64 string. Please ensure the format is correct.'
      );
    }
  }

  // getFileMetadata(
  //   base64String: string,
  //   fileName: string
  // ): { name: string; type: string; size: string } | null {
  //   try {
  //     // Extracting the content type and base64 data part from the string
  //     const matches = base64String.match(/^data:(.*?);base64,(.*)$/);
  //     if (!matches || matches.length !== 3) {
  //       console.error('Invalid base64 string format');
  //       return null;
  //     }

  //     const mimeType = matches[1]; // Get the MIME type
  //     const base64Data = matches[2]; // Get the base64 content

  //     // Decoding the base64 string to get the file size in bytes
  //     const decodedData = atob(base64Data);
  //     const sizeInBytes = decodedData.length;

  //     // Convert size to KB or MB
  //     const formattedSize = this.formatSize(sizeInBytes);

  //     // Return file metadata
  //     return {
  //       name: fileName,
  //       type: mimeType,
  //       size: formattedSize, // Formatted size in KB or MB
  //     };
  //   } catch (error) {
  //     console.error('Error getting file metadata:', error);
  //     return null;
  //   }
  // }

  // private formatSize(sizeInBytes: number): string {
  //   const sizeInKB = sizeInBytes / 1024;
  //   if (sizeInKB >= 1024) {
  //     const sizeInMB = sizeInKB / 1024;
  //     return `${sizeInMB.toFixed(2)} MB`; // Display in MB with 2 decimal places
  //   }
  //   return `${sizeInKB.toFixed(2)} KB`; // Display in KB with 2 decimal places
  // }

  showContactInfo() {
    this.userService.contactInfoVisible = true;
  }
  // utility.ts or any utility file
formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

}
