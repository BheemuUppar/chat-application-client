import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { UtilService } from 'src/app/services/util.service';

interface User {
  user_id: string;
  name: string;
  email: string;
  mobile: string;
  profile_path: string | null;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username!: string;
  password!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private utilService: UtilService
  ) {
    if (localStorage.getItem('token')) this.router.navigateByUrl('/');
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.code == 'Enter') {
      this.login()
    }
  }

  login() {
    if (!this.username || !this.password) {
      this.utilService.openSnackBar('Enter credentials to login');
      return;
    }
    this.authService
      .loginUser({ username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.utilService.openSnackBar(res.message);

          let decoded: User = jwtDecode(res.token);
          localStorage.setItem('id', decoded.user_id);

          this.getuserdata(decoded);
        },
        error: (error) => {
          console.log(error);
          this.utilService.openSnackBar(error.error.message);
        },
      });
  }
  getuserdata(decoded: any) {
    this.userService.getUserData(decoded.user_id).subscribe((res) => {
      let user = this.userService.user;
      if (user.profile_path != null) {
        this.router.navigateByUrl('/');
      } else {
        this.router.navigateByUrl('upload/profile');
      }
    });
  }
}
