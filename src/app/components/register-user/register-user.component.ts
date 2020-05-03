import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RegisterUser } from "src/app/models/register-user.model";
import { ToastrService } from "ngx-toastr";
import { RegisterUserService } from "src/app/services/register-user.service";
import { Router } from "@angular/router";
import { ValidateConfirmPassword } from 'src/app/validators/confirm-password.validator'

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  registerUserForm: FormGroup;
  passwordVisible: boolean;
  confirmPasswordVisible: boolean;
  isLoading: boolean;
  registerUser: RegisterUser;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private registerUserService: RegisterUserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoading = false;
    this.passwordVisible = false;
    this.registerUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: [ValidateConfirmPassword]
    })
  }

  register() {
    this.isLoading = true;
    this.registerUser = this.registerUserForm.getRawValue();
    delete this.registerUser.confirmPassword;
    this.registerUserService.registerUser(this.registerUser).subscribe(() => {
      this.isLoading = false;
      this.toastr.success('Usuário cadastrado com sucesso', 'Sucesso').onHidden.subscribe(() => {
        this.router.navigate(['login']);
      })
    })
  }

}
