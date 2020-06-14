import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-production-dashboard',
  templateUrl: './production-dashboard.component.html',
  styleUrls: ['./production-dashboard.component.css']
})
export class ProductionDashboardComponent implements OnInit {
  show = false;
  tableShow1 = false;
  tableShow2 = false;
  poCreateShow = false;
  proOCreateShow = false;
  poEditShow = false;
  proOEditShow = false;
  poArray = [];
  proOArray = [];
  logout: Function;
  constructor(private router:Router,private data:DataService , private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['shopfloorlogin']);
    }
    this.data.shopfloorAuth(token);

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
          this.router.navigate(['shopfloorlogin']);
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
  viewPO(){
    this.spinner.show();
    this.poArray.length = 0;
    this.poEditShow = false;
    this.poCreateShow = false;
    const myHeaders = new Headers();
    let matnr = (document.getElementById("matnr") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"matnr" : matnr});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getSPPO(options).then((response) => {
      response.json().then((res) => {
        this.poArray.push(res);
        this.spinner.hide();
        this.tableShow1 = true;
      })
    })
  }
  viewPOCreate(){
    this.tableShow1 = false;
    this.poEditShow = false;
    this.poCreateShow = true;
  }
  createPO(){
    this.spinner.show();
    const myHeaders = new Headers();
    let MaterialNo = (document.getElementById("matnr") as HTMLInputElement).value;
    let PlannedOrderNo = (document.getElementById("PlannedOrderNo") as HTMLInputElement).value;
    let PlanningPlant = (document.getElementById("PlanningPlant") as HTMLInputElement).value;
    let ProductionPlant = (document.getElementById("ProductionPlant") as HTMLInputElement).value;
    let OrderType = (document.getElementById("OrderType") as HTMLInputElement).value;
    let ProcurementType = (document.getElementById("ProcurementType") as HTMLInputElement).value;
    let TotalQuantity = (document.getElementById("TotalQuantity") as HTMLInputElement).value;
    let OrderStartDate = (document.getElementById("OrderStartDate") as HTMLInputElement).value;
    let OrderFinishDate = (document.getElementById("OrderFinishDate") as HTMLInputElement).value;
    let PurchasingOrganization = (document.getElementById("PurchasingOrganization") as HTMLInputElement).value;
    let StorageLocation = (document.getElementById("StorageLocation") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "MaterialNo" : MaterialNo,
        "PlannedOrderNo" : PlannedOrderNo,
        "PlanningPlant" : PlanningPlant,
        "ProductionPlant" : ProductionPlant,
        "OrderType" : OrderType,
        "ProcurementType" : ProcurementType,
        "TotalQuantity" : TotalQuantity,
        "OrderStartDate" : OrderStartDate,
        "OrderFinishDate" : OrderFinishDate,
        "PurchasingOrganization" : PurchasingOrganization,
        "StorageLocation" : StorageLocation
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getSPPOCU(options).then((response) => {
      response.json().then((res) => {
        
        if(res.status == "Success"){
          (document.getElementById("matnr") as HTMLInputElement).value = "";
          this.poCreateShow = false;
          this.spinner.hide();
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Planned Order Creation Successful',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else {
          console.log(res);
          swal.fire('Creation failed', 'Check the values entered', 'error');
        }
        
      })
    })
  }
  viewEditPO(){
    this.poCreateShow = false;
    this.tableShow1 = false;
    this.spinner.show();
    const myHeaders = new Headers();
    let matnr = (document.getElementById("matnr") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"matnr" : matnr});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getSPPO(options).then((response) => {
      response.json().then((res) => {
        this.poArray.push(res);
        this.spinner.hide();
        this.poEditShow = true;
      })
    })
   
  }
  editPO(){
    
    this.poArray.length = 0;
    const myHeaders = new Headers();
    this.spinner.show();
    let MaterialNo = (document.getElementById("matnr") as HTMLInputElement).value;
    let PlannedOrderNo = (document.getElementById("ePlannedOrderNo") as HTMLInputElement).value;
    let PlanningPlant = (document.getElementById("ePlanningPlant") as HTMLInputElement).value;
    let ProductionPlant = (document.getElementById("eProductionPlant") as HTMLInputElement).value;
    let OrderType = (document.getElementById("eOrderType") as HTMLInputElement).value;
    let ProcurementType = (document.getElementById("eProcurementType") as HTMLInputElement).value;
    let TotalQuantity = (document.getElementById("eTotalQuantity") as HTMLInputElement).value;
    let OrderStartDate = (document.getElementById("eOrderStartDate") as HTMLInputElement).value;
    let OrderFinishDate = (document.getElementById("eOrderFinishDate") as HTMLInputElement).value;
    let PurchasingOrganization = (document.getElementById("ePurchasingOrganization") as HTMLInputElement).value;
    let StorageLocation = (document.getElementById("eStorageLocation") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "MaterialNo" : MaterialNo,
        "PlannedOrderNo" : PlannedOrderNo,
        "PlanningPlant" : PlanningPlant,
        "ProductionPlant" : ProductionPlant,
        "OrderType" : OrderType,
        "ProcurementType" : ProcurementType,
        "TotalQuantity" : TotalQuantity,
        "OrderStartDate" : OrderStartDate,
        "OrderFinishDate" : OrderFinishDate,
        "PurchasingOrganization" : PurchasingOrganization,
        "StorageLocation" : StorageLocation
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getSPPOCU(options).then((response) => {
      response.json().then((res) => {
        
        if(res.status == "Success"){
          (document.getElementById("matnr") as HTMLInputElement).value = "";
          this.spinner.hide();
          this.poCreateShow = false;
          this.poEditShow = false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Planned Order Updation Successful',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else {
          console.log(res);
          swal.fire('Creation failed', 'Check the values entered', 'error');
        }
        
      })
    })

  }
  viewProO(){
    this.spinner.show();
    this.proOArray.length = 0;
    this.proOEditShow = false;
    this.proOCreateShow = false;
    const myHeaders = new Headers();
    let PlannedOrderNumber = (document.getElementById("PlannedOrderNo2") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"PlannedOrderNumber" : PlannedOrderNumber});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getSPProO(options).then((response) => {
      response.json().then((res) => {
        this.proOArray.push(res);
        this.spinner.hide();
        this.tableShow2 = true;
      })
    })
  }
  viewProOCreate(){
    this.tableShow2 = false;
    this.proOEditShow = false;
    this.proOCreateShow = true;
  }
  createProO(){
    this.spinner.show();
    const myHeaders = new Headers();
    let PlannedOrderNumber = (document.getElementById("PlannedOrderNo2") as HTMLInputElement).value;
    let ProductionOrderNumber = (document.getElementById("ProductionOrderNumber") as HTMLInputElement).value;
    let OrderType = (document.getElementById("OrderType2") as HTMLInputElement).value;
    let OrderCategory = (document.getElementById("OrderCategory") as HTMLInputElement).value;
    let EnteredBy = (document.getElementById("EnteredBy") as HTMLInputElement).value;
    let CreatedOn = (document.getElementById("CreatedOn") as HTMLInputElement).value;
    let CompanyCode = (document.getElementById("CompanyCode") as HTMLInputElement).value;
    let Plant = (document.getElementById("Plant") as HTMLInputElement).value;
    let BusinessArea = (document.getElementById("BusinessArea") as HTMLInputElement).value;
    let ControllingArea = (document.getElementById("ControllingArea") as HTMLInputElement).value;
    let Location = (document.getElementById("Location") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "PlannedOrderNumber" : PlannedOrderNumber,
        "ProductionOrderNumber" : ProductionOrderNumber,
        "OrderType" : OrderType,
        "OrderCategory" : OrderCategory,
        "EnteredBy" : EnteredBy,
        "CreatedOn" : CreatedOn,
        "CompanyCode" : CompanyCode,
        "Plant" : Plant,
        "BusinessArea" : BusinessArea,
        "ControllingArea" : ControllingArea,
        "Location" : Location
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getSPProOCU(options).then((response) => {
      response.json().then((res) => {
        
        if(res.status == "Success"){
          (document.getElementById("PlannedOrderNo2") as HTMLInputElement).value = "";
          this.spinner.hide();
          this.proOCreateShow = false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Production Order Creation Successful',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else {
          console.log(res);
          swal.fire('Creation failed', 'Check the values entered', 'error');
        }
        
      })
    })
  }
  viewEditProO(){
    this.proOCreateShow = false;
    this.tableShow2 = false;
    this.spinner.show();
    const myHeaders = new Headers();
    let PlannedOrderNumber = (document.getElementById("PlannedOrderNo2") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"PlannedOrderNumber" : PlannedOrderNumber});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getSPProO(options).then((response) => {
      response.json().then((res) => {
        this.proOArray.push(res);
        this.spinner.hide();
        this.proOEditShow = true;
      })
    })
   
  }
  editProO(){
    this.spinner.show();
    this.proOArray.length = 0;
    const myHeaders = new Headers();
    let PlannedOrderNumber = (document.getElementById("PlannedOrderNo2") as HTMLInputElement).value;
    let ProductionOrderNumber = (document.getElementById("eProductionOrderNumber") as HTMLInputElement).value;
    let OrderType = (document.getElementById("eOrderType2") as HTMLInputElement).value;
    let OrderCategory = (document.getElementById("eOrderCategory") as HTMLInputElement).value;
    let EnteredBy = (document.getElementById("eEnteredBy") as HTMLInputElement).value;
    let CreatedOn = (document.getElementById("eCreatedOn") as HTMLInputElement).value;
    let CompanyCode = (document.getElementById("eCompanyCode") as HTMLInputElement).value;
    let Plant = (document.getElementById("ePlant") as HTMLInputElement).value;
    let BusinessArea = (document.getElementById("eBusinessArea") as HTMLInputElement).value;
    let ControllingArea = (document.getElementById("eControllingArea") as HTMLInputElement).value;
    let Location = (document.getElementById("eLocation") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "PlannedOrderNumber" : PlannedOrderNumber,
        "ProductionOrderNumber" : ProductionOrderNumber,
        "OrderType" : OrderType,
        "OrderCategory" : OrderCategory,
        "EnteredBy" : EnteredBy,
        "CreatedOn" : CreatedOn,
        "CompanyCode" : CompanyCode,
        "Plant" : Plant,
        "BusinessArea" : BusinessArea,
        "ControllingArea" : ControllingArea,
        "Location" : Location
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getSPProOCU(options).then((response) => {
      response.json().then((res) => {
        
        if(res.status == "Success"){
          (document.getElementById("PlannedOrderNo2") as HTMLInputElement).value = "";
          this.spinner.hide();
          this.proOCreateShow = false;
          this.proOEditShow = false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Production Order Updation Successful',
            showConfirmButton: false,
            timer: 1500
          })
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
