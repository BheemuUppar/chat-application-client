import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './auth.guard';
import { EditProfilePicComponent } from './components/edit-profile-pic/edit-profile-pic.component';

const routes: Routes = [
  {
    path:'auth/register', component:AuthComponent
  },
  {
    path:'auth/login', component:AuthComponent
  },
  {
    path:'upload/profile', component:EditProfilePicComponent
  },
  {
    path:'', component:HomeComponent,
    canActivate :[authGuard]
  },
  {
    path:'**', 
    redirectTo:''
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
