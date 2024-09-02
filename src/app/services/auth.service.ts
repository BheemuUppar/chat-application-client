import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { SocketService } from './socket.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private socketService:SocketService, private router:Router) {}

  registerUser(params:any) {
    let url = 'http://localhost:3000/auth/register';
    return this.http.post(url, params);
  }

  loginUser(params: { username: string; password: string }) {
    let url = 'http://localhost:3000/auth/login';
    return this.http.post(url, params).pipe(
      map((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        return res
      })
    );
  }
  logout() {
    localStorage.clear();
    this.socketService.disconnect()
    this.router.navigateByUrl('/auth/login');
  }
}
