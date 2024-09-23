import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
isLoading : boolean = false;

  constructor() { 
  
    
  }

  showLoader(){
    this.isLoading = true
  }
  
  hideLoader(){
    this.isLoading = false
  }
}
