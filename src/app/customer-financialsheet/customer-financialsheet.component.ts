import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-customer-financialsheet',
  templateUrl: './customer-financialsheet.component.html',
  styleUrls: ['./customer-financialsheet.component.css']
})
export class CustomerFinancialsheetComponent implements OnInit {
  show = false;
  invArray: any;
  paaArray: any;
  cmArray: any;
  osdArray: any;
  invoice: Function;
  payment: Function;
  credit: Function;
  overall: Function;
  logout: Function;
  constructor(private router:Router,private data:DataService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['customerlogin']);
    }
    this.data.customerAuth(token);
    this.invoice = () => {
      this.spinner.show();
    
    const myHeaders = new Headers();
    let CUSTOMERNUMBER = "C001";
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"CUSTOMERNUMBER" : CUSTOMERNUMBER});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getCusINV(options).then((response) => {
        response.json().then((res) => {
         this.invArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.invoice();
    this.payment = () => {
      this.spinner.show();
    
    const myHeaders = new Headers();
    let CUSTOMERNUMBER = "C001";
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"CUSTOMERNUMBER" : CUSTOMERNUMBER});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getCusPAA(options).then((response) => {
        response.json().then((res) => {
         this.paaArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.payment();
    this.credit = () => {
      this.spinner.show();
    
    const myHeaders = new Headers();
    let CUSTOMERNUMBER = "C001";
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"CUSTOMERNUMBER" : CUSTOMERNUMBER});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getCusCM(options).then((response) => {
        response.json().then((res) => {
         this.cmArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.credit();
    this.overall = () => {
      this.spinner.show();
    
    const myHeaders = new Headers();
    let CUSTOMERNUMBER = "C001";
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"CUSTOMERNUMBER" : CUSTOMERNUMBER});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getCusOSD(options).then((response) => {
        response.json().then((res) => {
         this.osdArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.overall();
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
          this.router.navigate(['customerlogin']);
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

}
