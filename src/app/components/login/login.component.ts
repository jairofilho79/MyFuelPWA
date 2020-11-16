import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.montarFormulario();
  }

  montarFormulario() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.min(6)]]
    })
  }

  submit() {
    const formValues = this.loginForm.value;

    this.auth.login(formValues.username, formValues.password)
      .subscribe(response => {
        const access_token = JSON.stringify(response);
        console.log(access_token)
        this.auth.armazenarToken(access_token);
      },
        err => {
          this.toastr
            .error('Usuário ou senha inválida', 'Error')
        }
      )

  }

}
