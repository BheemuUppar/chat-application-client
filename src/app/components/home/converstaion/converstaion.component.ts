import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-converstaion',
  templateUrl: './converstaion.component.html',
  styleUrls: ['./converstaion.component.css']
})
export class ConverstaionComponent implements AfterViewInit {
  
  constructor(){

  }
  ngAfterViewInit(): void {
    let div = document.getElementById('messages');
    if(div){
      div.scrollTo(0, div.scrollHeight)
    }
  }

}
