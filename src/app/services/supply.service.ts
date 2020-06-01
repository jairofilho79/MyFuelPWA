import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { Supply } from "../models/Supply";

import {environment} from 'src/environments/environment';
import { BehaviorSubject } from "rxjs";

const {server} = environment;

@Injectable({
  providedIn: 'root'
})
export class SupplyService {

  userSupplies = new BehaviorSubject<Supply[]>([]);
  _userSupplies = [];
  vehicleSupplies = new BehaviorSubject<Supply[]>([]);
  _vehicleSupplies = [];
  isLoadMoreAvailable = new BehaviorSubject(true);
  isLoading = new BehaviorSubject(false);

  constructor(
    private http: HttpClient
  ) { }

  getIsLoading() {
    return this.isLoading.asObservable();
  }

  getUserSupplies() {
    return this.userSupplies.asObservable();
  }
  getVehicleSupplies() {
    return this.vehicleSupplies.asObservable();
  }

  $isLoadMoreAvailable() {
    return this.isLoadMoreAvailable.asObservable();
  }

  createSupply(supply) {
    return this.http.post(server + '/abastecimentos/', supply);
  }

  getSupplyDetail(supplyId) {
    return this.http.get(server + '/abastecimentos/' + supplyId);
  }

  deleteSupply(supplyId) {
    return this.http.delete(server + '/abastecimentos/' + supplyId);
  }

  getSuppliesByUserId(userId, page=0) {
    this.isLoading.next(true);
    const params = new HttpParams()
      .append('page', ''+page);
    this.http.get(server + '/abastecimentos/user/' + userId, { params })
      .subscribe(
        (response: any) => {
          this._userSupplies = [...this._userSupplies, ...response.content];
          this.userSupplies.next(this._userSupplies);
          this.isLoadMoreAvailable.next(true);
          this.isLoading.next(false);
        },
        error => {
          if(error.status === 404) {
            this.isLoadMoreAvailable.next(false);
            this.userSupplies.next(this._userSupplies);
            this.isLoading.next(false);
          }
        }
      )
  }

  getSuppliesByVehicleId(vehicleId, page=0) {
    const params = new HttpParams()
      .append('page', ''+page);
    this.http.get(server + '/abastecimentos/veiculo/' + vehicleId, { params })
      .subscribe(
        (response: any) => {
          this._vehicleSupplies = [...this._vehicleSupplies, ...response.content];
          console.log(this._vehicleSupplies);
          this.vehicleSupplies.next(this._vehicleSupplies);
          this.isLoadMoreAvailable.next(true);
        },
        error => {
          if(error.status === 404) {
            this.isLoadMoreAvailable.next(false);
            this.vehicleSupplies.next(this._vehicleSupplies);
          }
        }
      )
  }

  clearUserSupplies() {
    this._userSupplies = []
    this.userSupplies.next(this._userSupplies);
  }

  clearVehicleSupplies() {
    this._vehicleSupplies = []
    this.vehicleSupplies.next(this._vehicleSupplies);
  }
}
