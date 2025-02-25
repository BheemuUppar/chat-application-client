import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-edit-profile-pic',
  templateUrl: './edit-profile-pic.component.html',
  styleUrls: ['./edit-profile-pic.component.css'],
})
export class EditProfilePicComponent {
  image: any;
  imagePath: any;
  message: string | undefined;
  url: string | ArrayBuffer | null | undefined;
  file: any;

  constructor(private userService: UserService, private router: Router,
    private utilService:UtilService
  ) {}

  onClickUpload() {
    let input = document.getElementById('input_file');
    input?.click();

    input?.addEventListener('input', (event: any) => {
      const files = event.target.files;
      if (files.length === 0) return;
      this.file = files[0];
      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = 'Only images are supported.';
        return;
      }

      const reader = new FileReader();
      this.imagePath = files;

      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.url = reader.result;
      };
    });
  }
  fromserver: any;
  save() {
    let id = localStorage.getItem('id');
    let email = localStorage.getItem('email');

    if (this.file != undefined) {
      this.userService.saveProfilePic(id, this.file).subscribe({
        next: (res: any) => {
          localStorage.setItem('user', JSON.stringify(res.data));
          this.fromserver = res.data.profile_path;
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.utilService.openSnackBar(err.message);
        },
      });
    }else{
      this.utilService.openSnackBar("Please Select image to proceed");
    }
  }

  skip() {
    this.router.navigateByUrl('/');
  }
}
