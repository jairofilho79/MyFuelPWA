import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { VehicleService } from "../services/vehicle.service";
import { Vehicle } from "../models/Vehicle";

@Injectable({
  providedIn: 'root'
})
export class CurrentVehicleGuard implements CanActivate {

  vehicle: Vehicle

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.vehicleService.isCurrentVehicleAvailable()) {
        return true;
      }
      this.router.navigate(['home']);
  }

}
