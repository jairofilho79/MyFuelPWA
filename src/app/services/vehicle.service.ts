import { Injectable } from '@angular/core';

import {environment} from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Vehicle } from "../models/Vehicle";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  vehicles = new BehaviorSubject<Vehicle[]>([]);

  constructor(
    private http: HttpClient
  ) { }

  getVehicles() {
    return this.vehicles.asObservable();
  }

  getVehicleByUserId(userId) {
    this.http
      .get(environment.server + '/veiculos/user/' + userId)
      .subscribe(
        (response: Vehicle[]) => {
          this.vehicles.next(response);
        },
        // error handling
      );
  }

  getVehicleById(vehicleId) {
    return this.http
      .get(environment.server + '/veiculos/' + vehicleId)
      .subscribe(
        (response: Vehicle[]) => {
          this.vehicles.next(response);
        },
        // error handling
      );
  }

  deleteVehicle(vehicleId) {
    return this.http.delete(environment.server + '/veiculos/' + vehicleId);
  }

  createNewVehicle(vehicle) {
    return this.http.post(environment.server + '/veiculos', vehicle);
  }
}
