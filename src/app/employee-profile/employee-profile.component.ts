import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  show = false;
  editable = false;
  loaded = false;
  employeeProfile : any;
  logout: Function;
  constructor(private router:Router,private data:DataService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['employeelogin']);
    }
    this.data.employeeAuth(token);
    this.spinner.show();
      const myHeaders = new Headers();
      let PersonnelNumber = "001";
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"PersonnelNumber" : PersonnelNumber});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getEMPProfile(options).then((response) => {
        response.json().then((res) => {
           this.employeeProfile = res;
           this.spinner.hide();
           this.loaded = true;
        })
      })
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
  updateProfile(){
    this.editable = true;
  }
  saveChanges(){
    this.spinner.show();
    const myHeaders = new Headers();
    let PersonnelNumber = (document.getElementById("PersonnelNumber") as HTMLInputElement).value;
    let EmployeeName = (document.getElementById("EmployeeName") as HTMLInputElement).value;
    let PersonnelArea = (document.getElementById("PersonnelArea") as HTMLInputElement).value;
    let EmployeeGroup = (document.getElementById("EmployeeGroup") as HTMLInputElement).value;
    let OrganizationalKey = (document.getElementById("OrganizationalKey") as HTMLInputElement).value;
    let BusinessArea = (document.getElementById("BusinessArea") as HTMLInputElement).value;
    let PayrollArea = (document.getElementById("PayrollArea") as HTMLInputElement).value;
    let OrganizationalUnit = (document.getElementById("OrganizationalUnit") as HTMLInputElement).value;
    let Position = (document.getElementById("Position") as HTMLInputElement).value;
    let SupervisorArea = (document.getElementById("SupervisorArea") as HTMLInputElement).value;
    let CompanyCode = (document.getElementById("CompanyCode") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "PersonnelNumber" : PersonnelNumber,
        "EmployeeName" : EmployeeName,
        "PersonnelArea" : PersonnelArea,
        "EmployeeGroup" : EmployeeGroup,
        "OrganizationalKey" : OrganizationalKey,
        "BusinessArea" : BusinessArea,
        "PayrollArea" : PayrollArea,
        "OrganizationalUnit" : OrganizationalUnit,
        "Position" : Position,
        "SupervisorArea" : SupervisorArea,
        "CompanyCode" : CompanyCode
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getEMPProfileCU(options).then((response) => {
      response.json().then((res) => {
        this.spinner.hide();
        if(res.status == "Success"){
          
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Employee Profile Updation Successful',
            showConfirmButton: false,
            timer: 1500
          })
          
         
        }
        else {
          console.log(res);
          swal.fire('Updation failed', 'Check the values entered', 'error');
        }
        
      })
      this.editable = false;
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
