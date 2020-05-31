import { Injectable } from '@angular/core';

// import {environment} from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { User } from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User = <User>{
    id: 2,
    name: 'username',
    email: 'email@mail.com',
    dataCadastro: '2020-03-10'
  }

  constructor(
    // private http: HttpClient
  ) { }

  getUser() {
    return this.user
  }

  // getUser(id) {
  //   return this.http.get(environment.server + '')
  // }

}
