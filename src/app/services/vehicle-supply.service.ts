import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Supply } from "../models/Supply";
import {environment} from 'src/environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";

const {server, pagination_length} = environment;

@Injectable({
  providedIn: 'root'
})
export class VehicleSupplyService {

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

  getVehicleSupplies() {
    return this.vehicleSupplies.asObservable();
  }

  $isLoadMoreAvailable() {
    return this.isLoadMoreAvailable.asObservable();
  }

  clearVehicleSupplies() {
    this._vehicleSupplies = []
    this.vehicleSupplies.next(this._vehicleSupplies);
  }

  getSuppliesByVehicleId(vehicleId, page=0) {
    const params = new HttpParams()
      .append('page', ''+page);
    this.http.get(server + '/abastecimentos/veiculo/' + vehicleId, { params })
      .subscribe(
        (response: any) => {
          this._vehicleSupplies = [...this._vehicleSupplies, ...response.content];
          this.vehicleSupplies.next(this._vehicleSupplies);
          if(response.content.length === pagination_length) {
            this.isLoadMoreAvailable.next(true);
          } else {
            this.isLoadMoreAvailable.next(false);
          }
        },
        error => {
          if(error.status === 404) {
            this.isLoadMoreAvailable.next(false);
            this.vehicleSupplies.next(this._vehicleSupplies);
          }
        }
      )
  }

  createSupply(supply) {
    return this.http.post(server + '/abastecimentos/', supply);
  }

  deleteSupply(supplyId) {
    return this.http.delete(server + '/abastecimentos/' + supplyId);
  }
}
