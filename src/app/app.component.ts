import { Component } from '@angular/core';
import { UtilService } from './services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chat-app';
  constructor(private utilService: UtilService) {
  
  }
}
