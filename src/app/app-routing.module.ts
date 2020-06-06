import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { CustomerFinancialsheetComponent } from './customer-financialsheet/customer-financialsheet.component';
import { VendorFinancialsheetComponent } from './vendor-financialsheet/vendor-financialsheet.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { EmployeeLeavedataComponent } from './employee-leavedata/employee-leavedata.component';
import { EmployeeSalarypayslipComponent } from './employee-salarypayslip/employee-salarypayslip.component';
import { MaintenanceDashboardComponent } from './maintenance-dashboard/maintenance-dashboard.component';
import { ProductionDashboardComponent } from './production-dashboard/production-dashboard.component';
import { SafetyDashboardComponent } from './safety-dashboard/safety-dashboard.component';
import { QualityDashboardComponent } from './quality-dashboard/quality-dashboard.component';



const routes: Routes = [
  { path:'' , redirectTo: '\home' , pathMatch:'full'},
  { path:'\home' , component: HomeComponent},
  { path:'\customerlogin' , component: CustomerLoginComponent},
  { path:'customerlogin/customerdashboard' , component: CustomerDashboardComponent},
  { path:'customerlogin/customerprofile' , component: CustomerProfileComponent},
  { path:'customerlogin/customerfinancialsheet' , component: CustomerFinancialsheetComponent},
  { path:'vendorlogin' , component: VendorLoginComponent},
  { path:'vendorlogin/vendorfinancialsheet' , component: VendorFinancialsheetComponent},
  { path:'vendorlogin/vendordashboard' , component: VendorDashboardComponent},
  { path:'vendorlogin/vendorprofile' , component: VendorProfileComponent},
  { path:'\employeelogin' , component: EmployeeLoginComponent},
  { path:'employeelogin/employeeprofile' , component: EmployeeProfileComponent},
  { path:'employeelogin/employeeleavedata' , component: EmployeeLeavedataComponent},
  { path:'employeelogin/employeesalarypayslip' , component: EmployeeSalarypayslipComponent},
  { path:'\maintenancelogin' , component: MaintenanceLoginComponent},
  { path:'maintenancelogin/maintenancedashboard' , component: MaintenanceDashboardComponent},
  { path:'\shopfloorlogin' , component: ShopfloorLoginComponent},
  { path:'shopfloorlogin/productiondashboard' , component: ProductionDashboardComponent},
  { path:'\ehsmlogin' , component: EhsmLoginComponent},
  { path:'ehsmlogin/safetydashboard' , component: SafetyDashboardComponent},
  { path:'\qualitylogin' , component: QualityLoginComponent},
  { path:'qualitylogin/qualitydashboard' , component: QualityDashboardComponent},
  { path:"**" , component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
