import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private toast: ToastrService,
    private router: Router
  ) { }

  showErrors(err) {
    console.log(err);
    console.log(err.error);
    if(err.error) {
      if(!err.error.campos) {
        this.toast.error(`${err.error.titulo}`, "Erro");
        return;
      }
      for(let campo of err.error.campos) {
        this.toast.error(`${err.error.titulo}: O campo ${campo.nome} ${campo.mensagem}`, "Erro");
      }
      return;
    }
    if(Object.getPrototypeOf(err).constructor.name === "ProgressEvent" || err.status === 401) {
      this.toast
        .error("Por favor, faça o Login", "Erro!")
        .onHidden
        .subscribe(() => {
          // this.userService.logout()
          this.router.navigate(['/', 'signin'])
        })
      return;
    }
    this.toast.error("Erro no servidor!", "Erro!");
    console.error(err)
  }
}
