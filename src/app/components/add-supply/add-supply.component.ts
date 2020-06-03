import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { VehicleService } from "src/app/services/vehicle.service";
import { Router } from "@angular/router";
import { ErrorHandlerService } from "src/app/services/error-handler.service";
import { Supply } from "src/app/models/Supply";
import { Vehicle } from "src/app/models/Vehicle";
import { VehicleSupplyService } from "src/app/services/vehicle-supply.service";

@Component({
  selector: 'mf-add-supply',
  templateUrl: './add-supply.component.html',
  styleUrls: ['./add-supply.component.css']
})
export class AddSupplyComponent implements OnInit {

  isLoading = false;
  supply: Supply
  addSupplyForm: FormGroup;
  $vehicle;
  vehicle: Vehicle

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private vehicleService: VehicleService,
    private supplyService: VehicleSupplyService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {
    this.isLoading = false;
    this.addSupplyForm = this.formBuilder.group({
      valor: ['', Validators.required],
      precoCombustivel: ['', Validators.required],
      tipoCombustivel: ['', Validators.required],
      kmAtual: ['', Validators.required],
      posto: ['', Validators.required]
    })
    this.$vehicle = this.vehicleService.getCurrentVehicle().subscribe(vehicle => this.vehicle = vehicle);
  }
  ngOnDestroy() {
    this.$vehicle.unsubscribe();
    this.supplyService.getSuppliesByVehicleId(this.vehicle.id,0);
  }

  register() {
    this.isLoading = true;
    this.supply = this.addSupplyForm.getRawValue();
    this.supply.veiculo = this.vehicle;
    const today = new Date();
    const month = today.getMonth() > 9 ? today.getMonth() : '0'+today.getMonth();
    const day = today.getDate() > 9 ? today.getDate() : '0'+today.getDate();
    this.supply.data = `${today.getFullYear()}-${month}-${day}`
    console.log(this.supply);
    this.supplyService
      .createSupply(this.supply)
      .subscribe(
        () => {
          this.isLoading = false;
          this.toastr
            .success('Abastecimento cadastrado com sucesso', 'Sucesso')
            .onHidden
            .subscribe(() => {
              this.router.navigate(['vehicleDetail']);
            })
        },
        err => {
          this.isLoading = false;
          this.errorHandler.showErrors(err);
        }
      )
  }

}
