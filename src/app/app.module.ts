import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthComponent } from './components/auth/auth.component';
import {HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EditProfilePicComponent } from './components/edit-profile-pic/edit-profile-pic.component';
import { DefaultImageDirective } from './directives/default-image.directive';
import { SidebarComponent } from './components/home/sidebar/sidebar.component';
import { ConverstaionComponent } from './components/home/converstaion/converstaion.component';
import { DateService } from './services/date.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FilteruserPipe } from './pipes/filteruser.pipe';
import { ContactInfoComponent } from './components/home/contact-info/contact-info.component';
import { FilePreviewComponent } from './components/shared/file-preview/file-preview.component';
import { MatDialogModule} from '@angular/material/dialog';
import { UserProfileComponent } from './components/home/sidebar/user-profile/user-profile.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatListComponent } from './components/home/sidebar/chat-list/chat-list.component';
import { LoaderComponent } from './components/shared/file-preview/loader/loader.component';
import { AppHttpInterceptor } from './interceptor/http';
import { TypingEffectComponent } from './components/shared/typing-effect/typing-effect.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AuthComponent,
    EditProfilePicComponent,
    DefaultImageDirective,
    SidebarComponent,
    ConverstaionComponent,
    FilteruserPipe,
    ContactInfoComponent,
    FilePreviewComponent,
    UserProfileComponent,
    ChatListComponent,
    LoaderComponent,
    TypingEffectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatCheckboxModule,
    BrowserAnimationsModule, 
    MatButtonModule, MatMenuModule, MatIconModule,MatTooltipModule,  MatDialogModule,
    MatSnackBarModule
  ],
  providers: [DateService, MatSnackBar,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
