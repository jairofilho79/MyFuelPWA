import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Supply } from "../models/Supply";
import {environment} from 'src/environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { OfflineService } from "./offline.service";
import Dexie from 'dexie';
import { UserService } from "./user.service";
import { User } from "../models/User";

const {server, pagination_length} = environment;

@Injectable({
  providedIn: 'root'
})
export class UserSupplyService {

  userSupplies = new BehaviorSubject<Supply[]>([]);
  _userSupplies = [];
  isLoadMoreAvailable = new BehaviorSubject(true);
  isLoading = new BehaviorSubject(false);
  isOnline: boolean;
  db: Dexie
  table: Dexie.Table<Supply, any>
  user: User;

  constructor(
    private http: HttpClient,
    private offlineService: OfflineService,
    private userService: UserService
  ) {
    this.dbInit();
    this._updateLocalSupplies();
    this.offlineService.isOnline().subscribe(online => {
      this.isOnline = online;
      if(this.isOnline) {
        this.getSuppliesByUserId(this.userService.getUser().id);
      } else {
        this.isLoadMoreAvailable.next(false);
      }
    });
  }

  dbInit() {
    this.db = new Dexie('db-user-supplies');
    this.db.version(1).stores({
      supply: 'id'
    });
    this.table = this.db.table('supply');
  }

  getIsLoading() {
    return this.isLoading.asObservable();
  }

  getUserSupplies() {
    return this.userSupplies.asObservable();
  }

  $isLoadMoreAvailable() {
    return this.isLoadMoreAvailable.asObservable();
  }

  async _clearUserSupplies() {
    if(this.isOnline) {
      await this.table.clear();
    }
    this._userSupplies = []
    this.userSupplies.next(this._userSupplies);
  }

  async _updateLocalSupplies() {
    const supplies = await this.table.toArray();
    this._userSupplies = supplies;
    this.userSupplies.next(this._userSupplies);
  }

  getSuppliesByUserId(userId, page=0) {
    if(this.isOnline) {
      this._getSBUIdOn(userId, page);
    } else {
      this._updateLocalSupplies();
    }
  }

  //getSuppliesByUserIdOnline
  async _getSBUIdOn(userId, page) {
    try {
      this.isLoading.next(true);
      const params = new HttpParams()
        .append('page', ''+page);

      const response = <any> await this.http.get(server + '/abastecimentos/user/' + userId, { params }).toPromise();

      try {
        if(page === 0) {
          await this._clearUserSupplies();
        }
        await this.table.bulkAdd(response.content);
      } catch(e) {}
      finally {
        this._updateLocalSupplies();
        if(response.content.length === pagination_length) {
          this.isLoadMoreAvailable.next(true);
        } else {
          this.isLoadMoreAvailable.next(false);
        }
        this.isLoading.next(false);
      }
    } catch(e) {
      // if(e.status === 404) {
      // }
      this.userSupplies.next(this._userSupplies);
      this.isLoadMoreAvailable.next(false);
      this.isLoading.next(false);
    }
  }
}
