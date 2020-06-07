import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Supply } from "../models/Supply";
import {environment} from 'src/environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { OfflineService } from "./offline.service";
import Dexie from 'dexie';
import { VehicleService } from "./vehicle.service";
import { Vehicle } from "../models/Vehicle";

const {server, pagination_length} = environment;

@Injectable({
  providedIn: 'root'
})
export class VehicleSupplyService {

  vehicleSupplies = new BehaviorSubject<Supply[]>([]);
  isLoadMoreAvailable = new BehaviorSubject(true);
  isLoading = new BehaviorSubject(false);
  isOnline: boolean;
  db: Dexie;
  vehicle: Vehicle;

  constructor(
    private http: HttpClient,
    private offlineService: OfflineService,
    private vehicleService: VehicleService
  ) {
    this.dbInit();
    this.offlineService.isOnline().subscribe(online => {
      this.isOnline = online;
      console.log('online', online);
      if(this.isOnline) {
        this.updateAllAPIWithLocalData();
      } else {
        this.isLoadMoreAvailable.next(false);
      }
    });
    this.vehicleService.getCurrentVehicle().subscribe(vehicle => {
      this.vehicle = vehicle
      this._updateLocalSupplies();
    });
  }

  dbInit() {
    this.db = new Dexie('db-vehicle-supplies');
    this.db.version(1).stores({
      supply: 'id',
      addSupply: 'id',
      removeSupply: 'id',
    });
  }

  getIsLoading() {
    return this.isLoading.asObservable();
  }

  getVehicleSupplies() {
    return this.vehicleSupplies.asObservable();
  }

  $isLoadMoreAvailable() {
    return this.isLoadMoreAvailable.asObservable();
  }

  currentVehicleFilter = (supply: Supply)  => supply.veiculo.id === this.vehicle.id

  async _clearVehicleSupplies() {
    if(this.isOnline) {
      const suppliesKeysToRemoveFromScreen = await this.db.table('supply')
        .filter(this.currentVehicleFilter)
        .keys()
      await this.db.table('supply')
        .bulkDelete(suppliesKeysToRemoveFromScreen)
    }
  }

  removeDataFromScreen() {
    this.vehicleSupplies.next([]);
  }

  async _updateLocalSupplies() {
    try {
      const supplies = await this.db
      .table('supply')
      .filter(this.currentVehicleFilter)
      .toArray();
    this.vehicleSupplies.next(supplies);
    } catch (e) {
      console.error(e);
    }
  }

  getSuppliesByVehicleId(page=0) {
    if(this.isOnline) {
      this._getSBVIdOn(page);
    }
    // else {
    //   this._updateLocalSupplies();
    // }
  }

  //getSuppliesByVehicleIdOnline
  async _getSBVIdOn(page) {
    try {
      const params = new HttpParams()
        .append('page', ''+page);

      const response = <any> await this.http.get(server + '/abastecimentos/veiculo/' + this.vehicle.id, { params }).toPromise();
      try {
        if(page === 0) {
          await this._clearVehicleSupplies();
        }
        await this.db.table('supply').bulkAdd(response.content);
      } catch(e) {}
      finally {
        await this._updateLocalSupplies();
        if(response.content.length === pagination_length) {
          this.isLoadMoreAvailable.next(true);
        } else {
          this.isLoadMoreAvailable.next(false);
        }
      }
    } catch(e) {
      // if(e.status === 404) {
      // }
      this.isLoadMoreAvailable.next(false);
    }
  }

  async createSupply(supply) {
    try {
      if (this.isOnline) {
        await this.createSupplyAPI(supply);
      } else {
        this.saveCreateSupply(supply);
      }
    } catch (e) {
      this.saveCreateSupply(supply);
      throw e;
    }
  }

  async saveCreateSupply(supply) {
    supply.id = (Math.random()*100000000000000).toFixed(0);
    await this.db.table('addSupply').add(supply);
    await this.db.table('supply').add(supply);
    await this._updateLocalSupplies();
  }

  async createSupplyAPI(supply) {
    return this.http.post(server + '/abastecimentos/', supply).toPromise();
  }

  async deleteSupply(supplyId) {
    try {
      if (this.isOnline) {
        await this.deleteSupplyAPI(supplyId);
      } else {
        this.saveDeleteSupply(supplyId);
      }
    } catch (e) {
      this.saveDeleteSupply(supplyId);
      throw e;
    }
  }

  async saveDeleteSupply(supplyId) {
    await this.db.table('removeSupply').add({id: supplyId});
    await this.db.table('supply').delete(supplyId);
    try {
      await this.db.table('addSupply').delete(supplyId);
    } catch(e) {}
    await this._updateLocalSupplies();
  }

  async deleteSupplyAPI(supplyId) {
    return this.http.delete(server + '/abastecimentos/' + supplyId).toPromise();
  }

  //---------routine----------
  async updateRemoveSupplyWithLocalData() {
    const suppliesToDelete = await this.db.table('removeSupply').toArray();
    for(let {id} of suppliesToDelete) {
      try {
        await this.deleteSupplyAPI(id);
        await this.db.table('removeSupply').delete(id);
      } catch(e) {
        console.error(e);
        if(e.status === 404) {
          await this.db.table('removeSupply').delete(id);
        }
      }
    }
  }

  async updateAddSupplyWithLocalData() {
    const suppliesToCreate = await this.db.table('addSupply').toArray();
    for(let supply of suppliesToCreate) {
      let localSupplyId = supply.id;
      try {
        delete supply.id;
        await this.createSupplyAPI(supply);
        await this.db.table('addSupply').delete(localSupplyId);
      } catch(e) {
        console.error(e);
        if(e.status === 404) {
          await this.db.table('addSupply').delete(localSupplyId);
        }
      }
    }
  }

  async updateAllAPIWithLocalData() {
    await Promise.all([this.updateAddSupplyWithLocalData(), this.updateRemoveSupplyWithLocalData()]);
    this.getSuppliesByVehicleId();
  }
}



