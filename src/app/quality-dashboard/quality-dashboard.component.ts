import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-quality-dashboard',
  templateUrl: './quality-dashboard.component.html',
  styleUrls: ['./quality-dashboard.component.css']
})
export class QualityDashboardComponent implements OnInit {
  temp : any;
  show = false;
  insShow = true;
  tableShow = false;
  recordShow = false;
  useShow = false;
  logout: Function;
  insLotArray : any;
  constructor(private router:Router,private data:DataService , private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['qualitylogin']);
    }
    this.data.qualityAuth(token);
    this.viewTable();
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
          this.router.navigate(['qualitylogin']);
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
  toggle(){
    if(this.show){
        this.show = false;
        
    }
    else {
      this.show = true;
      
    }
  }
  viewTable(){
    this.spinner.show();
    const myHeaders = new Headers();
    let matnr = 1;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"matnr" : matnr});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getQPBInsLot(options).then((response) => {
      response.json().then((res) => {
        this.insLotArray = res;
        this.spinner.hide();
        this.tableShow = true;
      })
    })
  }
  viewRecord(){
    this.recordShow = true;
  }
  viewUse(){
    this.useShow = true;
  }
  createRecord(){
    this.spinner.show();
    const myHeaders = new Headers();
    let InspectionLotNo = this.temp;
    let InspectionCharNo = (document.getElementById("InspectionCharNo") as HTMLInputElement).value;
    let ResultAttribute = (document.getElementById("ResultAttribute") as HTMLInputElement).value;
    let InspectorName = (document.getElementById("InspectorName") as HTMLInputElement).value;
    let InspectionStartDate = (document.getElementById("InspectionStartDate") as HTMLInputElement).value;
    let InspectionEndDate = (document.getElementById("InspectionEndDate") as HTMLInputElement).value;
    let NoOfSampleUnits = (document.getElementById("NoOfSampleUnits") as HTMLInputElement).value;
    let NoOfDefects = (document.getElementById("NoOfDefects") as HTMLInputElement).value;
    let ValuesAboveTR = (document.getElementById("ValuesAboveTR") as HTMLInputElement).value;
    let ValuesBelowTR = (document.getElementById("ValuesBelowTR") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "InspectionLotNo" : InspectionLotNo,
        "InspectionCharNo" : InspectionCharNo,
        "ResultAttribute" : ResultAttribute,
        "InspectorName" : InspectorName,
        "InspectionStartDate" : InspectionStartDate,
        "InspectionEndDate" : InspectionEndDate,
        "NoOfSampleUnits" : NoOfSampleUnits,
        "NoOfDefects" : NoOfDefects,
        "ValuesAboveTR" : ValuesAboveTR,
        "ValuesBelowTR" : ValuesBelowTR
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getQPResRecCU(options).then((response) => {
      response.json().then((res) => {
        
        if(res.status == "Success"){
          this.spinner.hide();
          this.backtoil();
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Result Recording Successful',
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
  createUsage(){
    this.spinner.show();
    const myHeaders = new Headers();
    let InspectionLotNo = this.temp;
    let Date = (document.getElementById("Date") as HTMLInputElement).value;
    let Counter = (document.getElementById("Counter") as HTMLInputElement).value;
    let Plant = (document.getElementById("Plant") as HTMLInputElement).value;
    let SelectedSet = (document.getElementById("SelectedSet") as HTMLInputElement).value;
    let CodeGroup = (document.getElementById("CodeGroup") as HTMLInputElement).value;
    let Code = (document.getElementById("Code") as HTMLInputElement).value;
    let FollowUpAction = (document.getElementById("FollowUpAction") as HTMLInputElement).value;
    let QualityScore = (document.getElementById("QualityScore") as HTMLInputElement).value;
    let PersonResponsible = (document.getElementById("PersonResponsible") as HTMLInputElement).value;
    let Time = (document.getElementById("Time") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "InspectionLotNo" : InspectionLotNo,
        "Date" : Date,
        "Counter" : Counter,
        "Plant" : Plant,
        "SelectedSet" : SelectedSet,
        "CodeGroup" : CodeGroup,
        "Code" : Code,
        "FollowUpAction" : FollowUpAction,
        "QualityScore" : QualityScore,
        "PersonResponsible" : PersonResponsible,
        "Time" : Time
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getQPUseDecCU(options).then((response) => {
      response.json().then((res) => {
        
        if(res.status == "Success"){
          
          this.spinner.hide();
          this.backtoil();
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Usage Decision Creation Successful',
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
  recordForm(insLotNo)
  {
    this.temp = insLotNo;
    this.insShow = false;
    this.tableShow = false;
    this.recordShow = true;
  }
  usageForm(insLotNo){
    this.temp = insLotNo;
    this.insShow = false;
    this.tableShow = false;
    this.useShow = true;
  }
  backtoil(){
    this.recordShow = false;
    this.useShow = false;
    this.insShow = true;
    this.tableShow = true;
  }


}
