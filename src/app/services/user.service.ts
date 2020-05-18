import { Injectable } from '@angular/core';

// import {environment} from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  // getUser(id) {
  //   return this.http.get(environment.server + '')
  // }

}
