import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
interface User{
  id:string,
  name:string,
  email:string,
  mobile:string,
  profile_path:string | null
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  currentUser :User | undefined
  constructor(private router: Router, private userService: UserService) {
    let id = localStorage.getItem('id');
    this.userService.getUserData(id).subscribe(()=>{
     this.currentUser =  this.userService.user
    });
    
  }
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }
}
