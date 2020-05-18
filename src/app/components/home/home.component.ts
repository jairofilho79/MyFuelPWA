import { Component, OnInit } from '@angular/core';
import { VehicleService } from "src/app/services/vehicle.service";
import { Vehicle } from "src/app/models/Vehicle";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'mf-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  vehicles: Vehicle[];
  supplies = [
    {
      "valor": 35,
      "veiculo": {
        "placa": "KKK-2020",
        "cor": "#FFFFFF"
      }
    },
    {
      "valor": 50,
      "veiculo": {
        "placa": "JWC-2618",
        "cor": "#000000"
      }
    },{
      "valor": 60,
      "veiculo": {
        "placa": "JSF-2023",
        "cor": "#003366"
      }
    },{
      "valor": 100,
      "veiculo": {
        "placa": "JWC-2618",
        "cor": "#000000"
      }
    }
  ];
  isLoadingVehicles: boolean = false;
  isLoadingSupplies: boolean = false;
  treatedVehicles;
  treatedSupplies;

  constructor(
    private vehicleService: VehicleService,
    private toastr: ToastrService
  ) {
    this.treatedSupplies = this.treatSuppliesData(this.supplies);
  }

  ngOnInit() {

    this.vehicleService.getVehicles().subscribe(vehicles => {
      this.isLoadingVehicles = false;
      this.vehicles = vehicles;
      this.treatedVehicles = this.treatVehiclesData(vehicles);
    });
    this.isLoadingVehicles = true;
    this.vehicleService.getVehicleByUserId(2);
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
    const formatter = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      currencyDisplay: "symbol",
    });
    for (let supply of supplies) {
      newData.push(
        {
          text1: supply.veiculo.placa,
          text2: formatter.format(supply.valor),
          color: supply.veiculo.cor
        }
      )
    }
    return newData;
  }

  addNewVehicle() {
    alert('add new vehicle');
  }

  removeVehicle(vehicleIndex) {
    alert('olha isso' + this.vehicles[vehicleIndex].id);
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

  getVehicleDetail(vehicleIndex) {
    alert('Displaying details of vehicle ' + vehicleIndex);
  }

}
