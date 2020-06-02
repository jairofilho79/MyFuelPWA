import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { DialogComponent } from "../dialog/dialog.component";

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
    private userService: UserService,
    private dialog: MatDialog
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

  getCurrentMonthTotal() {
    if (this.isHomePage) {
      console.log('Pega tudo');
    } else {
      console.log('Pega do veículo');
    }
  }

}
