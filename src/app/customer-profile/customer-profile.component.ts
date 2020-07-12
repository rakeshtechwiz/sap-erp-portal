import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  show = false;
  editable = false;
  loaded = false;
  customerProfile : any;
  logout: Function;
  constructor(private router:Router,private data:DataService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['customerlogin']);
    }
    this.data.customerAuth(token);
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
    this.data.getCusPro(options).then((response) => {
      response.json().then((res) => {
         this.customerProfile = res;
         console.log(res);
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
  updateProfile(){
    this.editable = true;
  }
  saveChanges(){
    this.spinner.show();
    const myHeaders = new Headers();
    let CustomerNumber = (document.getElementById("CustomerNumber") as HTMLInputElement).value;
    let Name = (document.getElementById("Name") as HTMLInputElement).value;
    let CountryKey = (document.getElementById("CountryKey") as HTMLInputElement).value;
    let City = (document.getElementById("City") as HTMLInputElement).value;
    let PostalCode = (document.getElementById("PostalCode") as HTMLInputElement).value;
    let AccountNo = (document.getElementById("AccountNo") as HTMLInputElement).value;
    let ContactNo = (document.getElementById("ContactNo") as HTMLInputElement).value;
    let MailID = (document.getElementById("MailID") as HTMLInputElement).value;
    
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "CustomerNumber" : CustomerNumber,
        "Name" : Name,
        "CountryKey" : CountryKey,
        "City" : City,
        "PostalCode" : PostalCode,
        "AccountNo" : AccountNo,
        "ContactNo" : ContactNo,
        "MailID" : MailID
        
      });
      const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    this.data.getCusProCU(options).then((response) => {
      response.json().then((res) => {
        this.spinner.hide();
        if(res.status == "Success"){
          
          swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Customer Profile Updation Successful',
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
