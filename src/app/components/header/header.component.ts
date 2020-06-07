import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { DialogComponent } from "../dialog/dialog.component";
import { UserSupplyService } from "src/app/services/user-supply.service";
import { VehicleService } from "src/app/services/vehicle.service";
import { Vehicle } from "src/app/models/Vehicle";

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
  isOnline: boolean;
  vehicle: Vehicle;
  navigationBackTree = {
    '/addVehicle': 'home',
    '/vehicleDetail': 'home',
    '/addSupply': 'vehicleDetail'
  }
  vehiclesMonthTotal: any[];

  constructor(
    private location: Location,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private userSupplyService: UserSupplyService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit() {
    this.username = this.userService.getUser().name;
    this.verifyIsHomepage();
    this.location.onUrlChange(() => this.verifyIsHomepage());
    this.userSupplyService.getMonthTotal().subscribe(values => {
      if(values === undefined) {
        this.isOnline = false;
      } else {
        this.vehiclesMonthTotal = values;
        this.isOnline = true;
        this.setMonthTotalOnScreen();
      }
    });
    this.vehicleService.getCurrentVehicle().subscribe(vehicle => {
      this.vehicle = vehicle
      this.setMonthTotalOnScreen();
    });
  }

  setMonthTotalOnScreen() {
    if(!this.vehiclesMonthTotal) return;
    const valuesToFilter = this.vehicle ? this.vehiclesMonthTotal.filter(item => item.idVeiculo === this.vehicle.id) : this.vehiclesMonthTotal;
    this.currentMonthTotal = valuesToFilter.reduce((total, vehicle) => total + vehicle.valor, 0);
  }

  verifyIsHomepage() {
    this.isHomePage = this.location.path() === '/home';
  }

  goBack() {
    this.router.navigate([this.navigationBackTree[this.location.path()]])
  }

  confirmLogout() {
    const logoutDialog = this.dialog.open(DialogComponent, {
      width: '50vw',
      data: { reason: 'Você quer mesmo sair?'}
    })

    logoutDialog.afterClosed().subscribe((result) => result && this.logout());
  }

  logout() {
    // logout
    console.log('logout')
  }

  refreshTotalMonth() {
    this.userSupplyService._getMonthTotal()
  }

  getCurrentMonthTotal() {
    if (this.isHomePage) {
      console.log('Pega tudo');
    } else {
      console.log('Pega do veículo');
    }
  }

}
