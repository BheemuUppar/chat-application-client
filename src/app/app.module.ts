import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthComponent } from './components/auth/auth.component';
import {HttpClientModule } from '@angular/common/http';
import { EditProfilePicComponent } from './components/edit-profile-pic/edit-profile-pic.component';
import { DefaultImageDirective } from './directives/default-image.directive';
import { SidebarComponent } from './components/home/sidebar/sidebar.component';
import { ConverstaionComponent } from './components/home/converstaion/converstaion.component';
import { DateService } from './services/date.service';
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
    ConverstaionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
