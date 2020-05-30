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

  supplies = new BehaviorSubject<Supply[]>([]);
  _supplies = [];
  currentPage = new BehaviorSubject(0);
  totalPages = new BehaviorSubject(0);
  isLoadMoreAvailable = new BehaviorSubject(true);

  constructor(
    private http: HttpClient
  ) { }

  getSupplies() {
    return this.supplies.asObservable();
  }

  getCurrentPage() {
    return this.currentPage.asObservable();
  }

  setCurrentPage(currentPage) {
    return this.currentPage.next(currentPage);
  }

  getTotalPages() {
    return this.totalPages.asObservable();
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
    const params = new HttpParams()
      .append('page', ''+page);
    this.http.get(server + '/abastecimentos/user/' + userId, { params })
      .subscribe(
        (response: any) => {
          this.totalPages.next(response.totalPages);
          this._supplies = [...this._supplies, ...response.content];
          this.supplies.next(this._supplies);
        },
        error => {
          if(error.status === 404) {
            this.isLoadMoreAvailable.next(false);
          }
        }
      )
  }

  getSupplyesByVehicleId(vehicleId) {
    this.http.get(server + '/abastecimentos/veiculo/' + vehicleId)
      .subscribe(
        (response: any) => {
          this.totalPages.next(response.totalPages);
          this.supplies.next(response.content);
        }
      )
  }
}
