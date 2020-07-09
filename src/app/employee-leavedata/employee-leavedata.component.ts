import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-employee-leavedata',
  templateUrl: './employee-leavedata.component.html',
  styleUrls: ['./employee-leavedata.component.css']
})
export class EmployeeLeavedataComponent implements OnInit {
  show = false;
  hisshow = false;
  applyShow = false;
  leaveArray : any;
  logout: Function;
  initial: Function;
  constructor(private router:Router,private data:DataService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['employeelogin']);
    }
    this.data.employeeAuth(token);
    this.initial = (spinnerShow) => {
      if(spinnerShow == "yes"){
        this.spinner.show();
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"pernr" : "001"});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getEMPLeave(options).then((response) => {
        response.json().then((res) => {
         this.leaveArray = res;
         this.hisshow = true;
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
          this.router.navigate(['employeelogin']);
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
  backtohistory(){
     this.applyShow = false;
     this.hisshow = true;
  }
  applyLeave(){
    this.spinner.show();
    const myHeaders = new Headers();
    let PersonnelNumber = (document.getElementById("PersonnelNumber") as HTMLInputElement).value;
    let StartDate = (document.getElementById("StartDate") as HTMLInputElement).value;
    let EndDate = (document.getElementById("EndDate") as HTMLInputElement).value;
    let StartTime = (document.getElementById("StartTime") as HTMLInputElement).value;
    let EndTime = (document.getElementById("EndTime") as HTMLInputElement).value;
    let AttendanceOrAbsenceType = (document.getElementById("AttendanceOrAbsenceType") as HTMLInputElement).value;
    let AttendanceAndAbsenceDays = (document.getElementById("AttendanceAndAbsenceDays") as HTMLInputElement).value;
    let AbsenceHours = (document.getElementById("AbsenceHours") as HTMLInputElement).value;
    let ReferenceNumber = (document.getElementById("ReferenceNumber") as HTMLInputElement).value;
    let Position = (document.getElementById("Position") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "PersonnelNumber" : PersonnelNumber,
        "StartDate" : StartDate,
        "EndDate" : EndDate,
        "StartTime" : StartTime,
        "EndTime" : EndTime,
        "AttendanceOrAbsenceType" : AttendanceOrAbsenceType,
        "AttendanceAndAbsenceDays" : AttendanceAndAbsenceDays,
        "AbsenceHours" : AbsenceHours,
        "ReferenceNumber" : ReferenceNumber,
        "Position" : Position
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getEMPLeaveCU(options).then((response) => {
      response.json().then((res) => {
        this.spinner.hide();
        if(res.status == "Success"){
          this.applyShow = false;
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Leave Request Creation Successful',
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
  showForm(){
    this.hisshow = false;
    this.applyShow = true;
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
