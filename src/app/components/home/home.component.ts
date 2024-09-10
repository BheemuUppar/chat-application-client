import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  profile_path: string | null;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit{
  currentUser: User | undefined;
  // currentView: string = 'sidebar'; // Default to sidebar or any initial state
  isSmallScreen: boolean = false;

  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('conversation') conversation!: ElementRef;
  @ViewChild('info') info!: ElementRef;

  currentView: 'sidebar' | 'conversation' | 'info' = 'sidebar'; // Track current view for smaller screens

  ngAfterViewInit() {
    // You can perform further actions like setting z-index here
    this.adjustStylesForSmallScreens();
  }

  constructor(
    public userService: UserService,
    private socketService: SocketService
  ) {
    let id = localStorage.getItem('id');
    this.userService.getUserData(id).subscribe(() => {
      this.currentUser = this.userService.user;
    });

    // Add an event listener to check screen size on resize
    //  window.addEventListener('resize', () => this.checkScreenSize());
  }
  incomingMessage: any;

  ngOnInit(): void {
    this.socketService.connect();

    this.socketService.on('onlineusers', (data) => {
      console.log('online users ', data);
      this.userService.onlineUsers = data;
    });

    this.socketService.on('onMsgRead', (data) => {
      this.incomingMessage = data;
    });
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustStylesForSmallScreens();
  }

  currentChatMessage: any;
  messageReceived() {
    this.currentChatMessage = JSON.parse(JSON.stringify({}));
  }

  private adjustStylesForSmallScreens() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      this.isSmallScreen = true
      this.applyResponsiveStyles();
    } else {
      this.isSmallScreen = false
      this.resetStyles(); // Reset to default if screen is larger
    }
  }

  private applyResponsiveStyles() {
    // Example to hide all initially; make current view visible using z-index
    this.sidebar.nativeElement.style.zIndex = this.currentView === 'sidebar' ? '3' : '1';
    this.conversation.nativeElement.style.zIndex = this.currentView === 'conversation' ? '3' : '1';
    this.info.nativeElement.style.zIndex = this.currentView === 'info' ? '3' : '1';
  }

  private resetStyles() {
    // Reset styles for larger screens
    this.sidebar.nativeElement.style.zIndex = '1';
    this.conversation.nativeElement.style.zIndex = '1';
    this.info.nativeElement.style.zIndex = '1';
  }

  // Method to switch views for small screens
  switchView(view: 'sidebar' | 'conversation' | 'info') {
    console.log("event received..", view)
    this.currentView = view;
    this.applyResponsiveStyles();
  }
   
}
