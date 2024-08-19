import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { jwtDecode } from "jwt-decode";
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';

interface User{
  id:string,
  name:string,
  email:string,
  mobile:string,
  profile_path:string | null
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username!: string;
  password!: string;

  constructor(private authService: AuthService,
    private router:Router, private userService:UserService,
    private socket:SocketService
  ) {
    if(localStorage.getItem('token'))
    this.router.navigateByUrl('/')
  }

  login() {
    if (!this.username || !this.password) {
      alert('Enter credentials to login');
      return 
    }
    this.authService.loginUser({username:this.username, password:this.password}).subscribe({
      next:(res:any)=>{
        alert(res.message);
       
        let decoded : User= jwtDecode(res.token);
        localStorage.setItem("id", decoded.id)
        // localStorage.setItem("email", decoded.email)
        // localStorage.setItem("name", decoded.name)
        
        this.getuserdata(decoded)
        
        

      },
      error:(error)=>{
        console.log(error)
        alert(error.error.message);
      }
    })

  }
  getuserdata(decoded:any){
    this.userService.getUserData(decoded.id).subscribe((res)=>{
      let user = this.userService.user;
      if(user.profile_path != null){
        this.router.navigateByUrl('/');
        
      }else{
        this.router.navigateByUrl('upload/profile')
      }
     
    })
  }
}


