import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path:'auth/register', component:AuthComponent
  },
  {
    path:'auth/login', component:AuthComponent
  },
  {
    path:'', component:HomeComponent
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
