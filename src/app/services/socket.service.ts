import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor(private userService: UserService) {}

  connect(): void {
    this.socket = io('http://localhost:3000', {
      query: { id: this.userService.user.id ,
        email:this.userService.user.email
      },
    }); // Replace with your backend URL
  }
  
  // Method to listen for events
  on(eventName: string, callback: (data: any) => void) {
    this.socket.on(eventName, callback);
  }

  // Method to emit events
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  // Method to disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
