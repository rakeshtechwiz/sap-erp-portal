import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-vendor-financialsheet',
  templateUrl: './vendor-financialsheet.component.html',
  styleUrls: ['./vendor-financialsheet.component.css']
})
export class VendorFinancialsheetComponent implements OnInit {
  show = false;
  invoiceDetails: Function;
  paymentOverdues: Function;
  creditMemo: Function;
  invArray: any;
  poArray: any;
  crArray: any;
  logout: Function;
  constructor(private router:Router,private data:DataService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['vendorlogin']);
    }
    this.data.vendorAuth(token);
    this.invoiceDetails = () => {
      this.spinner.show();
    
    const myHeaders = new Headers();
    let VENDORNO = "V001";
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"VENDORNO" : VENDORNO});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getVenInvoice(options).then((response) => {
        response.json().then((res) => {
         this.invArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.invoiceDetails();
    this.paymentOverdues = () => {
      this.spinner.show();
    
    const myHeaders = new Headers();
    let VENDORNO = "V001";
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"VENDORNO" : VENDORNO});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getVenPayment(options).then((response) => {
        response.json().then((res) => {
         this.poArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.paymentOverdues();
    this.creditMemo = () => {
      this.spinner.show();
    
    const myHeaders = new Headers();
    let VENDORNO = "V001";
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"VENDORNO" : VENDORNO});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getVenCredit(options).then((response) => {
        response.json().then((res) => {
         this.crArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.creditMemo();
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
          this.router.navigate(['vendorlogin']);
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
