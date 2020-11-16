import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorIntl, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule, MatTabsModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from '@angular/service-worker';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddSupplyComponent } from './components/add-supply/add-supply.component';
import { AddVehicleComponent } from './components/add-vehicle/add-vehicle.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { GeneralListComponent } from './components/general-list/general-list.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import { getBrazilianPaginatorIntl } from './paginators/brazilian-paginator-intl';
import { DarkOrLightFontColorPipe } from './pipes/dark-or-light-font-color.pipe';
import { ListNameFormatPipe } from './pipes/list-name-format.pipe';
import { MonthNamePipe } from './pipes/month-name.pipe';
import { AuthService } from './services/auth.service';

export function jwtOptionsFactory(authService) {
  return {
    tokenGetter: () => {
      return authService.obterToken();
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterUserComponent,
    LoginComponent,
    NotFoundComponent,
    HomeComponent,
    MonthNamePipe,
    HeaderComponent,
    GeneralListComponent,
    DarkOrLightFontColorPipe,
    ListNameFormatPipe,
    AddVehicleComponent,
    VehicleDetailComponent,
    AddSupplyComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
    TextFieldModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService]
      }
    }),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    })
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getBrazilianPaginatorIntl() },
    AuthService
  ],
  bootstrap: [AppComponent, DialogComponent]
})
export class AppModule { }
