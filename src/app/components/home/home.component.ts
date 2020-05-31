import { Component, OnInit } from '@angular/core';
import { VehicleService } from "src/app/services/vehicle.service";
import { Vehicle } from "src/app/models/Vehicle";
import { ToastrService } from "ngx-toastr";
import { SupplyService } from "src/app/services/supply.service";
import brlFormatter from 'src/app/helper/currencyBRLFormatter';
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

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
    private vehicleService: VehicleService,
    private supplyService: SupplyService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {

    this.vehicleService.getVehicles().subscribe(vehicles => {
      this.isLoadingVehicles = false;
      this.vehicles = vehicles;
      this.treatedVehicles = this.treatVehiclesData(vehicles);
    });
    this.supplyService.getSupplies().subscribe(supplies => {
      this.isLoadingSupplies = false;
      this.treatedSupplies = this.treatSuppliesData(supplies);
      this.suppliesUpdate.next(this.treatedSupplies);
    })
    this.supplyService.$isLoadMoreAvailable().subscribe(verification => this.isLoadMoreSuppliesAvailable = verification);
    this.isLoadingVehicles = true;
    this.isLoadingSupplies = true;
    this.vehicleService.getVehicleByUserId(2);
    this.supplyService.getSuppliesByUserId(2);
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
          this.vehicleService.getVehicleByUserId(2);
        },
        err => {
          console.error(err);
          //error handling
        })
  }

  loadMoreSupplies() {
    this.supplyService.getSuppliesByUserId(2, ++this.currentPage);
  }

  getVehicleDetail(vehicleIndex) {
    alert('Displaying details of vehicle ' + vehicleIndex);
  }

}
