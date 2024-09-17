import { Component, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  @Input({ required: true }) user: any;
  profileImage !: any;
  profileFile : any;


  constructor(private userService:UserService){

  }

  onEditProfile() {
    // Logic to open edit modal or navigate to edit profile page
    console.log('Edit Profile button clicked');
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
      this.user.profile_path = reader.result;
      this.save()
    };
  }

  triggerFileInput() {
    const fileInput = document.getElementById('profile') as HTMLInputElement;
    fileInput.click();
  }

  save() {
    let id = localStorage.getItem('id');

    if (this.profileFile != undefined) {
      this.userService.saveProfilePic(id, this.profileFile).subscribe({
        next: (res: any) => {
          localStorage.setItem('user', JSON.stringify(res.data));
          alert('profile updated...')
        },
        error: (err) => {
          alert(err.message)
        },
      });
    }else{
      alert("Please Select image to proceed")
    }
  }
}
