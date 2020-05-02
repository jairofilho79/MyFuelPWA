import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterUserComponent } from "./components/register-user/register-user.component";
import { LoginComponent } from "./components/login/login.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registerUser'
  },
  {
    path: 'registerUser',
    component: RegisterUserComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
