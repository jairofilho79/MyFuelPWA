import { Component, OnInit } from '@angular/core';
import brlFormatter from 'src/app/helper/currencyBRLFormatter';
import { SupplyService } from "src/app/services/supply.service";
import { VehicleService } from "src/app/services/vehicle.service";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { Supply } from "src/app/models/Supply";
import { Vehicle } from "src/app/models/Vehicle";
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

  constructor(
    private supplyService: SupplyService,
    private vehicleService: VehicleService,
    // private router: Router,
    // private toastr: ToastrService,

  ) { }

  ngOnInit() {
    this.currentPage = 0;
    this.supplyService.getIsLoading().subscribe(isLoading => this.isLoadingSupplies = isLoading);
    this.supplyService.getVehicleSupplies().subscribe(supplies => {
      this.treatedSupplies = this.treatSuppliesData(supplies);
      this.suppliesUpdate.next(this.treatedSupplies);
    })
    this.supplyService.$isLoadMoreAvailable().subscribe(verification => this.isLoadMoreSuppliesAvailable = verification);
    this.vehicleService.getCurrentVehicle().subscribe(vehicle => {console.log(vehicle); this.vehicle = vehicle});
  }

  ngOnDestroy() {
    this.supplyService.clearVehicleSupplies();
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
    // alert('New Supply');
  }

  loadMoreSupplies() {
    console.log(this.vehicle);
    this.supplyService.getSuppliesByVehicleId(this.vehicle.id, ++this.currentPage);
  }

}
