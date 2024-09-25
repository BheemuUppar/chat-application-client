import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
})
export class ContactInfoComponent implements OnInit {
  inbox_id!: number;
  data: any;
  participants!: number;
  currentChat: any;
  @Output() viewChange = new EventEmitter<
    'sidebar' | 'conversation' | 'info'
  >();
  count: { image: number; document: number } = { image: 0, document: 0 };
  profileFile: any;

  constructor(private userService: UserService, private utilService:UtilService) {}
  ngOnInit(): void {
    this.userService.currenChat$.subscribe((chat: any) => {
      this.inbox_id = chat.inbox_id;
      this.currentChat = chat;
      if (this.inbox_id) {
        this.getChatInfo();
      }
    });
  }

  getChatInfo() {
    if (this.currentChat.isgroup) {
      this.userService.getChatInfo(this.inbox_id).subscribe((data: any) => {
        this.data = data[0];
        this.participants = this.data.group_members.length;
        this.updateCount(data[0].messages)
      });
    } else {
      this.userService
        .getChatInfoChat(this.currentChat.contact_id, this.inbox_id)
        .subscribe((data: any) => {
          this.data = data[0];
          this.updateCount(data[0].messages)
        });
    }
  }
  updateCount(messages: any[]) {
    this.count.document = 0;
    this.count.image = 0;
    messages.forEach(msg=>{
      if(msg.file_type == 'jpg' || msg.file_type == 'jpeg' || msg.file_type == 'png'){
        this.count.image++
      }else{
        this.count.document++
      }
    })
  }

  closeInfoPage() {
    this.userService.contactInfoVisible = false;
    this.changeView('info');
  }

  changeView(view: 'sidebar' | 'conversation' | 'info') {
    this.viewChange.emit(view);
  }
  triggerFileInput() {
    const fileInput = document.getElementById('groupFile') as HTMLInputElement;
    fileInput.click();
  }
  onGroupProfileUpload(event: any) {
    let files = event.target.files;
    if (files.length === 0) return;
    this.profileFile = files[0];
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    // this.imagePath = files;

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.currentChat.profile_path = reader.result;
      this.save()
    };
  }

  save() {
    if (this.profileFile != undefined) {
      this.userService.changeGroupProfilePic(this.currentChat.inbox_id, this.profileFile).subscribe({
        next: (res: any) => {
          this.utilService.openSnackBar('Profile updated successfully');
        },
        error: (err) => {
          this.utilService.openSnackBar(err.message);
        },
      });
    }else{
      this.utilService.openSnackBar("Please Select image to proceed");
    }
  }
}
