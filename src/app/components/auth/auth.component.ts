import { Component } from '@angular/core';
import { Router, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  currentScreen: string = 'register';
  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent
        )
      )
      .subscribe((e: RouterEvent) => {

        if (e.url.includes('auth/register')) {
          this.currentScreen = 'register';
        }
        if (e.url.includes('auth/login')) {
          this.currentScreen = 'login';
        }

      });
  }
}
