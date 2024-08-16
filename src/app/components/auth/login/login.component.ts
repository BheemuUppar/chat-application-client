import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username!: string;
  password!: string;

  constructor(private authService: AuthService, private router:Router) {
    if(localStorage.getItem('token'))
    this.router.navigateByUrl('/')
  }

  login() {
    if (!this.username || !this.password) {
      alert('Enter credentials to login');
      return 
    }
    this.authService.loginUser({username:this.username, password:this.password}).subscribe({
      next:(res)=>{
        alert(res.message);
        this.router.navigateByUrl('/')

      },
      error:(error)=>{
        console.log(error)
        alert(error.error.message);
      }
    })
  }
}
