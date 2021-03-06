import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterUserComponent } from "./components/register-user/register-user.component";
import { LoginComponent } from "./components/login/login.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { HomeComponent } from "./components/home/home.component";
import { AddVehicleComponent } from "./components/add-vehicle/add-vehicle.component";
import { VehicleDetailComponent } from "./components/vehicle-detail/vehicle-detail.component";
import { AddSupplyComponent } from "./components/add-supply/add-supply.component";
import { CurrentVehicleGuard } from "./guards/current-vehicle.guard";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'registerUser',
    component: RegisterUserComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'addVehicle',
    component: AddVehicleComponent
  },
  {
    path: 'vehicleDetail',
    component: VehicleDetailComponent,
    canActivate: [CurrentVehicleGuard]
  },
  {
    path: 'addSupply',
    component: AddSupplyComponent,
    canActivate: [CurrentVehicleGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
