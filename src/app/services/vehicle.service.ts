import { Injectable } from '@angular/core';

import {environment} from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Vehicle } from "../models/Vehicle";
import { BehaviorSubject } from "rxjs";
import { OfflineService } from "./offline.service";
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  vehicles = new BehaviorSubject<Vehicle[]>([]);
  currentVehicle = new BehaviorSubject<Vehicle>(undefined);
  currentVehicleCheck: boolean;
  isLoading = new BehaviorSubject<boolean>(false);
  isOnline: boolean;
  db: Dexie

  constructor(
    private http: HttpClient,
    private offlineService: OfflineService
  ) {
    this.dbInit();
    this.offlineService.isOnline().subscribe(online => {
      this.isOnline = online;
      this.updateAllAPIWithLocalData();
    });
  }

  dbInit() {
    this.db = new Dexie('db-vehicle');
    this.db.version(1).stores({
      vehicle: 'id',
      addVehicle: 'id',
      removeVehicle: 'id'
    });
  }

  getVehicles() {
    return this.vehicles.asObservable();
  }

  getCurrentVehicle() {
    return this.currentVehicle.asObservable();
  }

  isCurrentVehicleAvailable() {
    return this.currentVehicleCheck;
  }

  setCurrentVehicle(vehicle) {
    this.currentVehicleCheck = true
    this.currentVehicle.next(vehicle);
  }

  clearCurrentVehicle() {
    this.currentVehicleCheck = false;
  }

  getIsLoading() {
    return this.isLoading.asObservable();
  }

  async _updateLocalVehicles() {
    const vehicles = await this.db.table('vehicle').toArray();
    this.vehicles.next(vehicles);
  }

  getVehicleByUserId(userId) {
    if(this.isOnline) {
      this._getVBUIdOn(userId);
    } else {
      this._updateLocalVehicles();
    }
  }
  //getVehicleByUserIdOnline
  _getVBUIdOn(userId) {
    this.isLoading.next(true);
    this.http
      .get(environment.server + '/veiculos/user/' + userId)
      .subscribe(
        async (response: Vehicle[]) => {
          this.vehicles.next(response);
          this.isLoading.next(false);
          await this.db.table('vehicle').clear();
          await this.db.table('vehicle').bulkAdd(response);
        },
        () => {
          this.isLoading.next(false);
        }
      );
  }
  //Unused!!!!
  getVehicleById(vehicleId) {
    this.isLoading.next(true);
    return this.http
      .get(environment.server + '/veiculos/' + vehicleId)
      .subscribe(
        (response: Vehicle[]) => {
          this.vehicles.next(response);
          this.isLoading.next(false);
        },
        () => {
          this.isLoading.next(false);
        }
      );
  }

  async deleteVehicle(vehicleId) {
    try {
      if (this.isOnline) {
        await this.deleteVehicleAPI(vehicleId);
      } else {
        await this.db.table('removeVehicle').add({id: vehicleId});
        await this.db.table('vehicle').delete(vehicleId);
        await this._updateLocalVehicles();
      }
    } catch (e) {
      throw e;
    }
  }

  async deleteVehicleAPI(vehicleId) {
    return this.http.delete(environment.server + '/veiculos/' + vehicleId).toPromise();
  }

  async createNewVehicle(vehicle) {
    try {
      if (this.isOnline) {
        await this.createNewVehicleAPI(vehicle);
      } else {
        vehicle.id = (Math.random()*100000000000000).toFixed(0);
        console.log(vehicle);
        await this.db.table('addVehicle').add(vehicle);
        await this.db.table('vehicle').add(vehicle);
        await this._updateLocalVehicles();
      }
    } catch (e) {
      throw e;
    }
  }

  async createNewVehicleAPI(vehicle) {
    return this.http.post(environment.server + '/veiculos', vehicle).toPromise();
  }

  //---------routine----------
  async updateRemoveVehicleWithLocalData() {
    const vehiclesToDelete = await this.db.table('removeVehicle').toArray();
    for(let {id} of vehiclesToDelete) {
      console.log(id);
      try {
        await this.deleteVehicleAPI(id);
        await this.db.table('removeVehicle').delete(id);
      } catch(e) {
        console.error(e);
        if(e.status === 404) {
          await this.db.table('removeVehicle').delete(id);
        }
      }
    }
  }

  async updateAddVehicleWithLocalData() {
    const vehiclesToCreate = await this.db.table('addVehicle').toArray();
    for(let vehicle of vehiclesToCreate) {
      console.log(vehicle);
      let localVehicleId = vehicle.id;
      try {
        delete vehicle.id;
        await this.createNewVehicleAPI(vehicle);
        await this.db.table('addVehicle').delete(localVehicleId);
      } catch(e) {
        console.error(e);
        if(e.status === 404) {
          await this.db.table('addVehicle').delete(localVehicleId);
        }
      }
    }
  }

  async updateAllAPIWithLocalData() {
    await Promise.all([this.updateAddVehicleWithLocalData(), this.updateRemoveVehicleWithLocalData()]);
    this._getVBUIdOn(2);
  }
}
