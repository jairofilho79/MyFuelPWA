import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { MatFormFieldModule, MatInputModule, MatPaginatorIntl, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import {TextFieldModule} from '@angular/cdk/text-field';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { MonthNamePipe } from './pipes/month-name.pipe';
import { HeaderComponent } from './components/header/header.component';
import { GeneralListComponent } from './components/general-list/general-list.component';
import { DarkOrLightFontColorPipe } from './pipes/dark-or-light-font-color.pipe';
import { ListNameFormatPipe } from './pipes/list-name-format.pipe';
import { AddVehicleComponent } from './components/add-vehicle/add-vehicle.component';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import { AddSupplyComponent } from './components/add-supply/add-supply.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { getBrazilianPaginatorIntl } from './paginators/brazilian-paginator-intl';

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
    TextFieldModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    })
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getBrazilianPaginatorIntl() }
  ],
  bootstrap: [AppComponent, DialogComponent]
})
export class AppModule { }
