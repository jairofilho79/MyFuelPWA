import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RegisterUser } from "../models/register-user.model";

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  constructor(
    private http: HttpClient
  ) { }

  registerUser(user: RegisterUser) {
    return this.http.post(environment.server + '/user', user);
  }
}
