import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-employee-salarypayslip',
  templateUrl: './employee-salarypayslip.component.html',
  styleUrls: ['./employee-salarypayslip.component.css']
})
export class EmployeeSalarypayslipComponent implements OnInit {
  show = false;
  tableShow = false;
  pay : any;
  logout: Function;
  constructor(private router:Router,private data:DataService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['employeelogin']);
    }
    this.data.employeeAuth(token);
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
  viewPay(){
    this.spinner.show();
    const myHeaders = new Headers();
    
    let PersonnelNumber = "001";
    let Month = (document.getElementById("Month") as HTMLInputElement).value;
    let Year = (document.getElementById("Year") as HTMLInputElement).value;
    console.log(Month);
    console.log(Year);
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({"PersonnelNumber" : PersonnelNumber,
                                "Month" : Month,
                                "Year"  : Year});
    const options = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    this.data.getEMPPay(options).then((response) => {
      response.json().then((res) => {
        
        this.pay = res;
        this.spinner.hide();
        this.tableShow = true;
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
