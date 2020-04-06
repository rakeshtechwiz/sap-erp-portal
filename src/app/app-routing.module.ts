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



const routes: Routes = [
  { path:'' , redirectTo: '\home' , pathMatch:'full'},
  { path:'\home' , component: HomeComponent},
  { path:'\customerlogin' , component: CustomerLoginComponent},
  { path:'customerlogin/customerdashboard' , component: CustomerDashboardComponent},
  { path:'vendorlogin' , component: VendorLoginComponent},
  { path:'\employeelogin' , component: EmployeeLoginComponent},
  { path:'\maintenancelogin' , component: MaintenanceLoginComponent},
  { path:'\shopfloorlogin' , component: ShopfloorLoginComponent},
  { path:'\ehsmlogin' , component: EhsmLoginComponent},
  { path:'\qualitylogin' , component: QualityLoginComponent},
  { path:"**" , component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
