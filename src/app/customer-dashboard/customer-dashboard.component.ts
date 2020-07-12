import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  show = false;
  inqshow = false;
  sodArray: any;
  inqArray: any;
  lodArray: any;
  listofDelivery: Function;
  saleOrder: Function;
  logout: Function;
  
  constructor(private router:Router,private data:DataService, private spinner: NgxSpinnerService) { 
    
  }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['customerlogin']);
    }
    this.data.customerAuth(token);
    this.saleOrder = () => {
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
      this.data.getCusSOD(options).then((response) => {
        response.json().then((res) => {
         this.sodArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.saleOrder();
    this.listofDelivery = () => {
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
      this.data.getCusLOD(options).then((response) => {
        response.json().then((res) => {
         this.lodArray = Array.of(res);
         
         this.spinner.hide();
       
        })
      })
    }
    this.listofDelivery();
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
  viewINQ(){
    this.spinner.show();
    
    const myHeaders = new Headers();
    let INQUIRYNUMBER = (document.getElementById("INQUIRYNUMBER") as HTMLInputElement).value;
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({"INQUIRYNUMBER" : INQUIRYNUMBER});
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      this.data.getCusINQ(options).then((response) => {
        response.json().then((res) => {
         this.inqArray = Array.of(res);
         this.inqshow = true;
         this.spinner.hide();
       
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
