import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'mf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username;
  currentMonth = new Date();
  currentMonthTotal = 120.26
  isHomePage: boolean = true;
  navigationBackTree = {
    '/addVehicle': 'home',
    '/vehicleDetail': 'home',
    '/addSupply': 'vehicleDetail'
  }

  constructor(
    private location: Location,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.username = this.userService.getUser().name;
    this.verifyIsHomepage();
    this.location.onUrlChange(() => this.verifyIsHomepage());
  }

  verifyIsHomepage() {
    this.isHomePage = this.location.path() === '/home';
  }

  goBack() {
    this.router.navigate([this.navigationBackTree[this.location.path()]])
  }

  logout() {
    // alert('logout');
  }

  getCurrentMonthTotal() {
    if (this.isHomePage) {
      console.log('Pega tudo');
    } else {
      console.log('Pega do veículo');
    }
  }

}
