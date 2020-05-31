import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ErrorHandlerService } from "src/app/services/error-handler.service";
import { Vehicle } from "src/app/models/Vehicle";
import { VehicleService } from "src/app/services/vehicle.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'mf-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  addVehicleForm: FormGroup;
  isLoading: boolean;
  vehicle: Vehicle;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private vehicleService: VehicleService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.isLoading = false;
    this.addVehicleForm = this.formBuilder.group({
      ano: ['', Validators.required],
      capacidadeTanque: ['', Validators.required],
      cor: ['#000000', Validators.required],
      km: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placa: ['', Validators.required]
    })
  }

  register() {
    this.isLoading = true;
    this.vehicle = this.addVehicleForm.getRawValue();
    this.vehicle.user = this.userService.getUser();
    console.log(this.vehicle);
    this.vehicleService
      .createNewVehicle(this.vehicle)
      .subscribe(
        () => {
          this.isLoading = false;
          this.toastr
            .success('Veículo cadastrado com sucesso', 'Sucesso')
            .onHidden
            .subscribe(() => {
              this.router.navigate(['home']);
            })
        },
        err => {
          this.isLoading = false;
          this.errorHandler.showErrors(err);
        }
      )
  }

}
