import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-safety-dashboard',
  templateUrl: './safety-dashboard.component.html',
  styleUrls: ['./safety-dashboard.component.css']
})
export class SafetyDashboardComponent implements OnInit {
  show = false;
  imshow = false;
  rashow = false;
  imcushow = false;
  imeditshow = false;
  editIndex : any;
  incidentArray : any;
  riskArray: any;
  logout: Function;
  initial: Function;
  constructor(private router:Router,private data:DataService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['ehsmlogin']);
    }
    this.data.ehsmAuth(token);
    this.initial = (spinnerShow) => {
      if(spinnerShow == "yes"){
        this.spinner.show();
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"working" : "yes"});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getEPIM(options).then((response) => {
        response.json().then((res) => {
         this.incidentArray = res;
         this.imshow = true;
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
          this.router.navigate(['ehsmlogin']);
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
  viewRA(objnr){
    this.spinner.show();
    const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"objnr" : objnr});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getEPRA(options).then((response) => {
      
        response.json().then((res) => {
         if(res.null == "null")
         {
           this.spinner.hide();
              swal.fire(
              'No Risk Assessments Available',
              '',
              'info'
            );
         }
         else{
          this.riskArray = res;
          this.imshow = false;
          this.rashow = true;
          this.spinner.hide();
         }
         
        })
      })
  }
  backtoim(){
    this.rashow = false;
    this.imcushow = false;
    this.imeditshow = false;
    this.imshow = true;
  }
  viewIMCU(){
    this.imshow = false;
    this.imcushow = true;
  }
  createIM(){
    this.spinner.show();
    const myHeaders = new Headers();
    let ObjectNumber = (document.getElementById("ObjectNumber") as HTMLInputElement).value;
    let IncidentTitle = (document.getElementById("IncidentTitle") as HTMLInputElement).value;
    let ObjectCreatedBy = (document.getElementById("ObjectCreatedBy") as HTMLInputElement).value;
    let OrganizationalID = (document.getElementById("OrganizationalID") as HTMLInputElement).value;
    let PlantID = (document.getElementById("PlantID") as HTMLInputElement).value;
    let Location = (document.getElementById("Location") as HTMLInputElement).value;
    let StartDate = (document.getElementById("StartDate") as HTMLInputElement).value;
    let EndDate = (document.getElementById("EndDate") as HTMLInputElement).value;
    let DateOfIncidentReporting = (document.getElementById("DateOfIncidentReporting") as HTMLInputElement).value;
    let LossOfProduction = (document.getElementById("LossOfProduction") as HTMLInputElement).value;
    let StreetOrHouseNum = (document.getElementById("StreetOrHouseNum") as HTMLInputElement).value;
    let PostalCode = (document.getElementById("PostalCode") as HTMLInputElement).value;
    let City = (document.getElementById("City") as HTMLInputElement).value;
    let Country = (document.getElementById("Country") as HTMLInputElement).value;
    let Region = (document.getElementById("Region") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "ObjectNumber" : ObjectNumber,
        "Region" : Region,
        "IncidentTitle" : IncidentTitle,
        "ObjectCreatedBy" : ObjectCreatedBy,
        "OrganizationalID" : OrganizationalID,
        "PlantID" : PlantID,
        "Location" : Location,
        "StartDate" : StartDate,
        "EndDate" : EndDate,
        "DateOfIncidentReporting" : DateOfIncidentReporting,
        "LossOfProduction" : LossOfProduction,
        "StreetOrHouseNum" : StreetOrHouseNum,
        "PostalCode" : PostalCode,
        "City" : City,
        "Country" : Country
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getEPIMCU(options).then((response) => {
      response.json().then((res) => {
        this.spinner.hide();
        if(res.status == "Success"){
          this.imcushow = false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Incident Creation Successful',
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
  viewEdit(i){
    this.imshow = false;
    this.imeditshow = true;
    this.editIndex = i;
  }
  updateIM(){
    this.spinner.show();
    const myHeaders = new Headers();
    let ObjectNumber = (document.getElementById("eObjectNumber") as HTMLInputElement).value;
    let IncidentTitle = (document.getElementById("eIncidentTitle") as HTMLInputElement).value;
    let ObjectCreatedBy = (document.getElementById("eObjectCreatedBy") as HTMLInputElement).value;
    let OrganizationalID = (document.getElementById("eOrganizationalID") as HTMLInputElement).value;
    let PlantID = (document.getElementById("ePlantID") as HTMLInputElement).value;
    let Location = (document.getElementById("eLocation") as HTMLInputElement).value;
    let StartDate = (document.getElementById("eStartDate") as HTMLInputElement).value;
    let EndDate = (document.getElementById("eEndDate") as HTMLInputElement).value;
    let DateOfIncidentReporting = (document.getElementById("eDateOfIncidentReporting") as HTMLInputElement).value;
    let LossOfProduction = (document.getElementById("eLossOfProduction") as HTMLInputElement).value;
    let StreetOrHouseNum = (document.getElementById("eStreetOrHouseNum") as HTMLInputElement).value;
    let PostalCode = (document.getElementById("ePostalCode") as HTMLInputElement).value;
    let City = (document.getElementById("eCity") as HTMLInputElement).value;
    let Country = (document.getElementById("eCountry") as HTMLInputElement).value;
    let Region = (document.getElementById("eRegion") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "ObjectNumber" : ObjectNumber,
        "Region" : Region,
        "IncidentTitle" : IncidentTitle,
        "ObjectCreatedBy" : ObjectCreatedBy,
        "OrganizationalID" : OrganizationalID,
        "PlantID" : PlantID,
        "Location" : Location,
        "StartDate" : StartDate,
        "EndDate" : EndDate,
        "DateOfIncidentReporting" : DateOfIncidentReporting,
        "LossOfProduction" : LossOfProduction,
        "StreetOrHouseNum" : StreetOrHouseNum,
        "PostalCode" : PostalCode,
        "City" : City,
        "Country" : Country
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getEPIMCU(options).then((response) => {
      response.json().then((res) => {
        this.spinner.hide();
        if(res.status == "Success"){
          this.imeditshow= false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Incident Updation Successful',
            showConfirmButton: false,
            timer: 1500
          })
          this.initial();
         
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
