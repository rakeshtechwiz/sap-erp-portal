import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { MaintenanceLoginComponent } from './maintenance-login/maintenance-login.component';
import { ShopfloorLoginComponent } from './shopfloor-login/shopfloor-login.component';
import { EhsmLoginComponent } from './ehsm-login/ehsm-login.component';
import { QualityLoginComponent } from './quality-login/quality-login.component';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';

import { DataService } from './data.service';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { CustomerFinancialsheetComponent } from './customer-financialsheet/customer-financialsheet.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { VendorFinancialsheetComponent } from './vendor-financialsheet/vendor-financialsheet.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { EmployeeLeavedataComponent } from './employee-leavedata/employee-leavedata.component';
import { EmployeeSalarypayslipComponent } from './employee-salarypayslip/employee-salarypayslip.component';
import { MaintenanceDashboardComponent } from './maintenance-dashboard/maintenance-dashboard.component';
import { ProductionDashboardComponent } from './production-dashboard/production-dashboard.component';
import { QualityDashboardComponent } from './quality-dashboard/quality-dashboard.component';
import { SafetyDashboardComponent } from './safety-dashboard/safety-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    CustomerLoginComponent,
    EmployeeLoginComponent,
    MaintenanceLoginComponent,
    ShopfloorLoginComponent,
    EhsmLoginComponent,
    QualityLoginComponent,
    VendorLoginComponent,
    CustomerDashboardComponent,
    CustomerProfileComponent,
    CustomerFinancialsheetComponent,
    VendorProfileComponent,
    VendorDashboardComponent,
    VendorFinancialsheetComponent,
    EmployeeProfileComponent,
    EmployeeLeavedataComponent,
    EmployeeSalarypayslipComponent,
    MaintenanceDashboardComponent,
    ProductionDashboardComponent,
    QualityDashboardComponent,
    SafetyDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SliderModule,
    FormsModule,
    ButtonModule,
    ChartModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
