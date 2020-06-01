import { Component, OnInit } from '@angular/core';
import { VehicleService } from "src/app/services/vehicle.service";
import { Vehicle } from "src/app/models/Vehicle";
import { ToastrService } from "ngx-toastr";
import { SupplyService } from "src/app/services/supply.service";
import brlFormatter from 'src/app/helper/currencyBRLFormatter';
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

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
  isLoadMoreSuppliesAvailable = true;

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private supplyService: SupplyService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.vehicleService.clearCurrentVehicle();
    this.supplyService.clearVehicleSupplies();
    this.currentPage = 0;
    this.supplyService.getIsLoading().subscribe(isLoading => this.isLoadingSupplies = isLoading);
    this.vehicleService.getIsLoading().subscribe(isLoading => this.isLoadingVehicles = isLoading);
    this.vehicleService.getVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
      this.treatedVehicles = this.treatVehiclesData(vehicles);
    });
    this.supplyService.getUserSupplies().subscribe(supplies => {
      this.treatedSupplies = this.treatSuppliesData(supplies);
      this.suppliesUpdate.next(this.treatedSupplies);
    })
    this.supplyService.$isLoadMoreAvailable().subscribe(verification => this.isLoadMoreSuppliesAvailable = verification);
    // TODO: getUser
    this.vehicleService.getVehicleByUserId(this.userService.getUser().id);
    this.supplyService.getSuppliesByUserId(this.userService.getUser().id);
  }
  //TODO: destroy and unsubscribe
  ngOnDestroy() {
    this.supplyService.clearUserSupplies();
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

  removeVehicle(vehicleIndex) {
    this.vehicleService
      .deleteVehicle(this.vehicles[vehicleIndex].id)
      .subscribe(
        () => {
          this.toastr.success("Veículo removido com sucesso", "Sucesso")
          this.vehicleService.getVehicleByUserId(this.userService.getUser().id);
        },
        err => {
          console.error(err);
          //error handling
        })
  }

  loadMoreSupplies() {
    this.supplyService.getSuppliesByUserId(this.userService.getUser().id, ++this.currentPage);
  }

  getVehicleDetail(vehicleIndex) {
    this.vehicleService.setCurrentVehicle(this.vehicles[vehicleIndex]);
    this.supplyService.getSuppliesByVehicleId(this.vehicles[vehicleIndex].id);
    this.router.navigate(['vehicleDetail']);
  }

}
