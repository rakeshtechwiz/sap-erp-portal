import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-maintenance-dashboard',
  templateUrl: './maintenance-dashboard.component.html',
  styleUrls: ['./maintenance-dashboard.component.css']
})
export class MaintenanceDashboardComponent implements OnInit {
  show = false;
  nocshow = false;
  noeshow = false;
  wocshow = false;
  woeshow = false;
  noshow = false;
  woshow = false;
  notificationArray: any;
  workArray: any;
  initial: any;
  editIndex = 0;
  logout: Function;
  constructor(private router:Router,private data:DataService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['maintenancelogin']);
    }
    this.data.maintenanceAuth(token);
    this.initial = (spinnerShow) => {
      if(spinnerShow == "yes"){
        this.spinner.show();
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let ANING = "Rakesh";
      const raw = JSON.stringify({"ANING" : ANING});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getMainNotification(options).then((response) => {
        response.json().then((res) => {
         this.notificationArray = res;
         this.noshow = true;
         if(spinnerShow == "yes"){
          this.spinner.hide();
        }
        })
      })
      this.data.getMainWork(options).then((response) => {
        response.json().then((res) => {
         this.workArray = res;
         this.woshow = true;
         if(spinnerShow == "yes"){
          this.spinner.hide();
        }
        })
      })
    }
    this.initial("yes");
    this.logout = () => {
      
      const swalWithBootstrapButtons = swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success ml-4',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          localStorage.clear();
          this.router.navigate(['maintenancelogin']);
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Logout Successful',
            showConfirmButton: false,
            timer: 1500
          })
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === swal.DismissReason.cancel
        ) {
          
        }
      }) 
    }
  }
  backtohis(){
      this.nocshow = false;
      this.noeshow = false;
      this.woeshow = false;
      this.wocshow = false;
      this.noshow = true;
      this.woshow = true;
  }
  viewnocshow(){
     this.noshow = false;
     this.woshow = false;
     this.nocshow = true;
  }
  viewnoeshow(i){
    this.editIndex = i;
    this.noshow = false;
    this.woshow = false;
    this.noeshow = true;
  }
  viewwocshow(){
    this.noshow = false;
    this.woshow = false;
    this.wocshow = true;
  }
  viewwoeshow(i){
   this.editIndex = i;
   this.noshow = false;
   this.woshow = false;
   this.woeshow = true;
  }
  createWO(){
    this.spinner.show();
    const myHeaders = new Headers();
    let OrderNumber = (document.getElementById("WOrderNumber") as HTMLInputElement).value;
    let PriorityType = (document.getElementById("WPriorityType") as HTMLInputElement).value;
    let Priority = (document.getElementById("WPriority") as HTMLInputElement).value;
    let EquipmentNumber = (document.getElementById("WEquipmentNumber") as HTMLInputElement).value;
    let ObjectID = (document.getElementById("WObjectID") as HTMLInputElement).value;
    let NameofPersonReponsibleforSystem = (document.getElementById("WNameofPersonReponsibleforSystem") as HTMLInputElement).value;
    let PlannedDowntimeinHours = (document.getElementById("WPlannedDowntimeinHours") as HTMLInputElement).value;
    let DateFromWhichTheSystemIsAvailable = (document.getElementById("WDateFromWhichTheSystemIsAvailable") as HTMLInputElement).value;
    let MaintenancePlan = (document.getElementById("WMaintenancePlan") as HTMLInputElement).value;
    let MaintenanceItem = (document.getElementById("WMaintenanceItem") as HTMLInputElement).value;
    let NotificationNo = (document.getElementById("WNotificationNo") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "OrderNumber" : OrderNumber,
        "PriorityType" : PriorityType,
        "Priority" : Priority,
        "EquipmentNumber" : EquipmentNumber,
        "ObjectID" : ObjectID,
        "NameofPersonReponsibleforSystem" : NameofPersonReponsibleforSystem,
        "PlannedDowntimeinHours" : PlannedDowntimeinHours,
        "DateFromWhichTheSystemIsAvailable" : DateFromWhichTheSystemIsAvailable,
        "MaintenancePlan" : MaintenancePlan,
        "MaintenanceItem" : MaintenanceItem,
        "NotificationNo" : NotificationNo
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getMainWorkCU(options).then((response) => {
      response.json().then((res) => {
        this.spinner.hide();
        if(res.status == "Success"){
          this.wocshow = false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Work Order Creation Successful',
            showConfirmButton: false,
            timer: 1500
          })
          this.initial("No");
         
        }
        else {
          console.log(res);
          swal.fire('Creation failed', 'Check the values entered', 'error');
        }
        
      })
    })
  }
  createNO(){
    this.spinner.show();
    const myHeaders = new Headers();
    let NotificationNo = (document.getElementById("NotificationNo") as HTMLInputElement).value;
    let PriorityType = (document.getElementById("PriorityType") as HTMLInputElement).value;
    let Priority = (document.getElementById("Priority") as HTMLInputElement).value;
    let TimeofNotification = (document.getElementById("TimeofNotification") as HTMLInputElement).value;
    let DateofNotification = (document.getElementById("DateofNotification") as HTMLInputElement).value;
    let NameofPersonReportingNotification = (document.getElementById("NameofPersonReportingNotification") as HTMLInputElement).value;
    let OrderNumber = (document.getElementById("OrderNumber") as HTMLInputElement).value;
    let MaterialNo = (document.getElementById("MaterialNo") as HTMLInputElement).value;
    let DateforNotificationCompletion = (document.getElementById("DateforNotificationCompletion") as HTMLInputElement).value;
    let InspectionLotNumber = (document.getElementById("InspectionLotNumber") as HTMLInputElement).value;
    let BatchNumber = (document.getElementById("BatchNumber") as HTMLInputElement).value;
    let PurchasingOrganization = (document.getElementById("PurchasingOrganization") as HTMLInputElement).value;
    let NameofPersonReponsibleforSystem = (document.getElementById("NameofPersonReponsibleforSystem") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "NotificationNo" : NotificationNo,
        "PriorityType" : PriorityType,
        "Priority" : Priority,
        "TimeofNotification" : TimeofNotification,
        "DateofNotification" : DateofNotification,
        "NameofPersonReportingNotification" : NameofPersonReportingNotification,
        "OrderNumber" : OrderNumber,
        "MaterialNo" : MaterialNo,
        "DateforNotificationCompletion" : DateforNotificationCompletion,
        "InspectionLotNumber" : InspectionLotNumber,
        "BatchNumber" : BatchNumber,
        "PurchasingOrganization" : PurchasingOrganization,
        "NameofPersonReponsibleforSystem" : NameofPersonReponsibleforSystem
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getMainNotificationCU(options).then((response) => {
      response.json().then((res) => {
        this.spinner.hide();
        if(res.status == "Success"){
          this.nocshow = false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Notification Creation Successful',
            showConfirmButton: false,
            timer: 1500
          })
          this.initial("No");
         
        }
        else {
          console.log(res);
          swal.fire('Creation failed', 'Check the values entered', 'error');
        }
        
      })
    })
  }
  updateNO(){
    this.spinner.show();
    const myHeaders = new Headers();
    let NotificationNo = (document.getElementById("eNotificationNo") as HTMLInputElement).value;
    let PriorityType = (document.getElementById("ePriorityType") as HTMLInputElement).value;
    let Priority = (document.getElementById("ePriority") as HTMLInputElement).value;
    let TimeofNotification = (document.getElementById("eTimeofNotification") as HTMLInputElement).value;
    let DateofNotification = (document.getElementById("eDateofNotification") as HTMLInputElement).value;
    let NameofPersonReportingNotification = (document.getElementById("eNameofPersonReportingNotification") as HTMLInputElement).value;
    let OrderNumber = (document.getElementById("eOrderNumber") as HTMLInputElement).value;
    let MaterialNo = (document.getElementById("eMaterialNo") as HTMLInputElement).value;
    let DateforNotificationCompletion = (document.getElementById("eDateforNotificationCompletion") as HTMLInputElement).value;
    let InspectionLotNumber = (document.getElementById("eInspectionLotNumber") as HTMLInputElement).value;
    let BatchNumber = (document.getElementById("eBatchNumber") as HTMLInputElement).value;
    let PurchasingOrganization = (document.getElementById("ePurchasingOrganization") as HTMLInputElement).value;
    let NameofPersonReponsibleforSystem = (document.getElementById("eNameofPersonReponsibleforSystem") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "NotificationNo" : NotificationNo,
        "PriorityType" : PriorityType,
        "Priority" : Priority,
        "TimeofNotification" : TimeofNotification,
        "DateofNotification" : DateofNotification,
        "NameofPersonReportingNotification" : NameofPersonReportingNotification,
        "OrderNumber" : OrderNumber,
        "MaterialNo" : MaterialNo,
        "DateforNotificationCompletion" : DateforNotificationCompletion,
        "InspectionLotNumber" : InspectionLotNumber,
        "BatchNumber" : BatchNumber,
        "PurchasingOrganization" : PurchasingOrganization,
        "NameofPersonReponsibleforSystem" : NameofPersonReponsibleforSystem
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getMainNotificationCU(options).then((response) => {
      response.json().then((res) => {
        this.spinner.hide();
        if(res.status == "Success"){
          this.noeshow = false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Notification Updation Successful',
            showConfirmButton: false,
            timer: 1500
          })
          this.initial("No");
         
        }
        else {
          console.log(res);
          swal.fire('Creation failed', 'Check the values entered', 'error');
        }
        
      })
    })
  }
  updateWO(){
    this.spinner.show();
    const myHeaders = new Headers();
    let OrderNumber = (document.getElementById("WeOrderNumber") as HTMLInputElement).value;
    let PriorityType = (document.getElementById("WePriorityType") as HTMLInputElement).value;
    let Priority = (document.getElementById("WePriority") as HTMLInputElement).value;
    let EquipmentNumber = (document.getElementById("WeEquipmentNumber") as HTMLInputElement).value;
    let ObjectID = (document.getElementById("WeObjectID") as HTMLInputElement).value;
    let NameofPersonReponsibleforSystem = (document.getElementById("WeNameofPersonReponsibleforSystem") as HTMLInputElement).value;
    let PlannedDowntimeinHours = (document.getElementById("WePlannedDowntimeinHours") as HTMLInputElement).value;
    let DateFromWhichTheSystemIsAvailable = (document.getElementById("WeDateFromWhichTheSystemIsAvailable") as HTMLInputElement).value;
    let MaintenancePlan = (document.getElementById("WeMaintenancePlan") as HTMLInputElement).value;
    let MaintenanceItem = (document.getElementById("WeMaintenanceItem") as HTMLInputElement).value;
    let NotificationNo = (document.getElementById("WeNotificationNo") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "OrderNumber" : OrderNumber,
        "PriorityType" : PriorityType,
        "Priority" : Priority,
        "EquipmentNumber" : EquipmentNumber,
        "ObjectID" : ObjectID,
        "NameofPersonReponsibleforSystem" : NameofPersonReponsibleforSystem,
        "PlannedDowntimeinHours" : PlannedDowntimeinHours,
        "DateFromWhichTheSystemIsAvailable" : DateFromWhichTheSystemIsAvailable,
        "MaintenancePlan" : MaintenancePlan,
        "MaintenanceItem" : MaintenanceItem,
        "NotificationNo" : NotificationNo
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getMainWorkCU(options).then((response) => {
      response.json().then((res) => {
        this.spinner.hide();
        if(res.status == "Success"){
          this.woeshow = false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Work Order Updation Successful',
            showConfirmButton: false,
            timer: 1500
          })
          this.initial("No");
         
        }
        else {
          console.log(res);
          swal.fire('Creation failed', 'Check the values entered', 'error');
        }
        
      })
    })
  }
  toggle(){
    if(this.show){
        this.show = false;
        
    }
    else {
      this.show = true;
      
    }
  }

}
