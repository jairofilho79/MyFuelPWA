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
  currentVehicle = new BehaviorSubject<Vehicle>(undefined);
  isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient
  ) { }

  getVehicles() {
    return this.vehicles.asObservable();
  }

  getCurrentVehicle() {
    return this.currentVehicle.asObservable();
  }

  setCurrentVehicle(vehicle) {
    this.currentVehicle.next(vehicle);
  }

  getIsLoading() {
    return this.isLoading.asObservable();
  }

  getVehicleByUserId(userId) {
    this.isLoading.next(true);
    this.http
      .get(environment.server + '/veiculos/user/' + userId)
      .subscribe(
        (response: Vehicle[]) => {
          this.vehicles.next(response);
          this.isLoading.next(false);
        },
        error => {
          this.isLoading.next(false);
        }
        // error handling
      );
  }

  getVehicleById(vehicleId) {
    this.isLoading.next(true);
    return this.http
      .get(environment.server + '/veiculos/' + vehicleId)
      .subscribe(
        (response: Vehicle[]) => {
          this.vehicles.next(response);
          this.isLoading.next(false);
        },
        error => {
          this.isLoading.next(false);
        }
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
