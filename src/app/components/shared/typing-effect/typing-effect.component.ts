import { Component, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-typing-effect',
  templateUrl: './typing-effect.component.html',
  styleUrls: ['./typing-effect.component.css']
})
export class TypingEffectComponent {
  @Input() user : any;

  @Input() name: undefined  | string;
  constructor(private userService:UserService, public utilService:UtilService){
  // this.userService.currenChat$.subscribe((user)=>{
  //   this.currentChat = user;
  // })
  }
}
