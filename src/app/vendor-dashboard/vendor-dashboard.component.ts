import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  show = false;
  quotationDetails: Function;
  purchaseOrder: Function;
  goodsReceipt: Function;
  qdArray: any;
  poArray: any;
  grArray: any;
  logout: Function;
  constructor(private router:Router,private data:DataService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['vendorlogin']);
    }
    this.data.vendorAuth(token);
    this.quotationDetails = () => {
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
      this.data.getVenQuotation(options).then((response) => {
        response.json().then((res) => {
         this.qdArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.quotationDetails();
    this.purchaseOrder = () => {
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
      this.data.getVenPurchase(options).then((response) => {
        response.json().then((res) => {
         this.poArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.purchaseOrder();
    this.goodsReceipt = () => {
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
      this.data.getVenGoods(options).then((response) => {
        response.json().then((res) => {
         this.grArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.goodsReceipt();
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
