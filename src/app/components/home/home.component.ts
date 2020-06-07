import { Component, OnInit } from '@angular/core';
import { VehicleService } from "src/app/services/vehicle.service";
import { Vehicle } from "src/app/models/Vehicle";
import { ToastrService } from "ngx-toastr";
import brlFormatter from 'src/app/helper/currencyBRLFormatter';
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { UserSupplyService } from "src/app/services/user-supply.service";
import { OfflineService } from "src/app/services/offline.service";
import { VehicleSupplyService } from "src/app/services/vehicle-supply.service";

@Component({
  selector: 'mf-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  vehicles: Vehicle[];
  isLoadingVehicles: boolean = false;
  isLoadingSupplies: boolean = false;
  treatedVehicles;
  treatedSupplies = [];
  currentPage = 0;
  suppliesUpdate = new BehaviorSubject<any>(undefined);
  vehiclesUpdate = new BehaviorSubject<any>(undefined);
  isLoadMoreSuppliesAvailable = true;
  isOnline: boolean;

  $isOnline;
  $supplyServiceGetIsLoading;
  $vehicleServiceGetIsLoading;
  $getVehicles;
  $getUserSupplies;
  $isLoadMoreAvailable;
  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private supplyService: UserSupplyService,
    private vehicleSupplyService: VehicleSupplyService,
    private toastr: ToastrService,
    private router: Router,
    private offlineService: OfflineService
  ) {}

  ngOnInit() {
    this.supplyService._getMonthTotal();
    this.$isOnline = this.offlineService.isOnline().subscribe(isOnline => this.isOnline = isOnline);
    this.$supplyServiceGetIsLoading = this.supplyService.getIsLoading().subscribe(isLoading => this.isLoadingSupplies = isLoading);
    this.$vehicleServiceGetIsLoading = this.vehicleService.getIsLoading().subscribe(isLoading => this.isLoadingVehicles = isLoading);
    this.$getVehicles = this.vehicleService.getVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
      this.treatedVehicles = this.treatVehiclesData(vehicles);
      this.vehiclesUpdate.next(this.treatedVehicles);
    });
    this.$getUserSupplies = this.supplyService.getUserSupplies().subscribe(supplies => {
      this.treatedSupplies = this.treatSuppliesData(supplies);
      this.suppliesUpdate.next(this.treatedSupplies);
    })
    this.$isLoadMoreAvailable = this.supplyService.$isLoadMoreAvailable().subscribe(verification => this.isLoadMoreSuppliesAvailable = verification);
    this.currentPage = 0;
    this.vehicleService.getVehicleByUserId(this.userService.getUser().id);
    this.supplyService.getSuppliesByUserId(this.userService.getUser().id);
  }
  //TODO: destroy and unsubscribe
  ngOnDestroy() {
    this.vehicleSupplyService.removeDataFromScreen();
    this.$isOnline.unsubscribe();
    this.$supplyServiceGetIsLoading.unsubscribe();
    this.$vehicleServiceGetIsLoading.unsubscribe();
    this.$getVehicles.unsubscribe();
    this.$getUserSupplies.unsubscribe();
    this.$isLoadMoreAvailable.unsubscribe();
  }
  treatVehiclesData(vehicles) {
    let newData = [];
    for(let vehicle of vehicles) {
      newData.push(
        {
          text1: vehicle.placa,
          text2: vehicle.modelo,
          color: vehicle.cor
        }
      )
    }
    return newData;
  }

  treatSuppliesData(supplies) {
    let newData = [];
    for (let supply of supplies) {
      newData.push(
        {
          text1: supply.veiculo.placa,
          text2: brlFormatter.format(supply.valor),
          color: supply.veiculo.cor
        }
      )
    }
    return newData;
  }

  addNewVehicle() {
    this.router.navigate(['addVehicle']);
  }

  async removeVehicle(vehicleIndex) {
    try {
      await this.vehicleService
        .deleteVehicle(this.vehicles[vehicleIndex].id);
      this.toastr.success("Veículo removido com sucesso", "Sucesso")
      this.vehicleService.getVehicleByUserId(this.userService.getUser().id);
    } catch(err) {
      console.error(err);
    }
  }

  loadMoreSupplies() {
    this.supplyService.getSuppliesByUserId(this.userService.getUser().id, ++this.currentPage);
  }

  getVehicleDetail(vehicleIndex) {
    this.vehicleService.setCurrentVehicle(this.vehicles[vehicleIndex]);
    this.router.navigate(['vehicleDetail']);
  }

}
