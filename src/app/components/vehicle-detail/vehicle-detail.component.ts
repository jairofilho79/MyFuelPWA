import { Component, OnInit } from '@angular/core';
import brlFormatter from 'src/app/helper/currencyBRLFormatter';
import { VehicleService } from "src/app/services/vehicle.service";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { Supply } from "src/app/models/Supply";
import { Vehicle } from "src/app/models/Vehicle";
import { Router } from "@angular/router";
import { ErrorHandlerService } from "src/app/services/error-handler.service";
import { VehicleSupplyService } from "src/app/services/vehicle-supply.service";
import { UserSupplyService } from "src/app/services/user-supply.service";
@Component({
  selector: 'mf-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {
  isLoadingSupplies: boolean;
  treatedSupplies: any[];
  suppliesUpdate = new BehaviorSubject<Supply[]>(undefined);
  isLoadMoreSuppliesAvailable: boolean;
  currentPage: number = 0;
  vehicle: Vehicle;
  supplies: Supply[]

  $isLoading;
  $getVehicleSupplies
  $isLoadMoreAvailable
  $getCurrentVehicle

  constructor(
    private userSupplyService: UserSupplyService,
    private supplyService: VehicleSupplyService,
    private vehicleService: VehicleService,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.currentPage = 0;
    this.$isLoading = this.supplyService.getIsLoading().subscribe(isLoading => this.isLoadingSupplies = isLoading);
    this.$getVehicleSupplies = this.supplyService.getVehicleSupplies().subscribe(supplies => {
      this.supplies = supplies;
      this.treatedSupplies = this.treatSuppliesData(supplies);
      this.suppliesUpdate.next(this.treatedSupplies);
    })
    this.$isLoadMoreAvailable = this.supplyService.$isLoadMoreAvailable().subscribe(verification => this.isLoadMoreSuppliesAvailable = verification);
    this.$getCurrentVehicle = this.vehicleService.getCurrentVehicle().subscribe(vehicle => this.vehicle = vehicle);
    this.supplyService.getSuppliesByVehicleId();
  }

  ngOnDestroy() {
    this.$isLoading.unsubscribe();
    this.$getVehicleSupplies.unsubscribe();
    this.$isLoadMoreAvailable.unsubscribe();
    this.$getCurrentVehicle.unsubscribe();
  }

  treatSuppliesData(supplies) {
    let newData = [];
    for (let supply of supplies) {
      newData.push(
        {
          text1: supply.posto,
          text2: brlFormatter.format(supply.valor),
          color: supply.veiculo.cor
        }
      )
    }
    return newData;
  }

  addNewSupply() {
    this.router.navigate(['addSupply'])
  }

  async removeSupply(index) {
    try {
      await this.supplyService
        .deleteSupply(this.supplies[index].id)
      this.toastr
      .success('Abastecimento removido com sucesso', 'Sucesso')
      .onHidden
      .subscribe(() => {
        this.supplyService.getSuppliesByVehicleId();
        this.router.navigate(['vehicleDetail']);
      })
      this.userSupplyService._getMonthTotal();
    } catch(e) {
      this.errorHandler.showErrors(e);
    }
  }

  loadMoreSupplies() {
    this.supplyService.getSuppliesByVehicleId(++this.currentPage);
  }

}
