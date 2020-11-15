import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { RegisterUser } from "src/app/models/register-user.model";
import { ErrorHandlerService } from "src/app/services/error-handler.service";
import { RegisterUserService } from "src/app/services/register-user.service";
import { ValidateConfirmPassword } from 'src/app/validators/confirm-password.validator';

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
    private router: Router,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {
    this.isLoading = false;
    this.passwordVisible = false;
    this.registerUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(6)]],
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
    this.registerUserService
      .registerUser(this.registerUser)
      .subscribe(
        () => {
          this.isLoading = false;
          this.toastr
            .success('Usuário cadastrado com sucesso', 'Sucesso')
            .onHidden
            .subscribe(() => {
              this.router.navigate(['login']);
            })
        },
        err => {
          this.isLoading = false;
          this.errorHandler.showErrors(err);
        }
      )
  }

  voltar() {
    this.router.navigate(['/login'])
  }
}
