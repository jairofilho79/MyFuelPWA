import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  isConnectedOnline = new BehaviorSubject<boolean>(undefined);

  constructor() {
    window.addEventListener('online', () => this.isConnectedOnline.next(true));
    window.addEventListener('offline', () => this.isConnectedOnline.next(false));
    this.isConnectedOnline.next(window.navigator.onLine);
  }

  isOnline() {
    return this.isConnectedOnline.asObservable();
  }
}
