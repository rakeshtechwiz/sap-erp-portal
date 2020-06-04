import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataService } from '../data.service';


@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  logout: Function;
  constructor(private router:Router,private data:DataService) { 
    
  }

  ngOnInit(): void {
    const token = localStorage.getItem("secret");
    if(token == null){
      swal.fire('Access Denied', 'Login to view this page', 'error');
      this.router.navigate(['customerlogin']);
    }
    this.data.customerAuth(token);
    this.logout = () => {
      localStorage.clear();
      this.router.navigate(['customerlogin']);
    }
  }
    
    
   

}
