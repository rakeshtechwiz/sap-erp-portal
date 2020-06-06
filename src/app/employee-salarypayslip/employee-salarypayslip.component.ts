import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';

@Component({
  selector: 'app-employee-salarypayslip',
  templateUrl: './employee-salarypayslip.component.html',
  styleUrls: ['./employee-salarypayslip.component.css']
})
export class EmployeeSalarypayslipComponent implements OnInit {
  show = false;
  logout: Function;
  constructor(private router:Router,private data:DataService) { }

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
  toggle(){
    if(this.show){
        this.show = false;
        
    }
    else {
      this.show = true;
      
    }
  }

}
