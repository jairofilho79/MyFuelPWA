import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  isConnectedOnline = new BehaviorSubject<boolean>(undefined);

  constructor() {
    window.addEventListener('online', () => {
      console.log('online')
      this.isConnectedOnline.next(true);
    })
    window.addEventListener('offline', () => {
      console.log('offline');
      this.isConnectedOnline.next(false);
    })
    this.isConnectedOnline.next(window.navigator.onLine);
  }

  isOnline() {
    return this.isConnectedOnline.asObservable();
  }
}
