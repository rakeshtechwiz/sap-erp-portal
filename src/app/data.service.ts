import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private router:Router) { }

  getData(requestOptions) {
     return fetch("http://localhost:8000/login",requestOptions);
  }

  login(options) {
    return fetch("http://localhost:8000/users/login",options);
  }
  //Auth functions
  customerAuth(token){ 
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer "+token);
      fetch("http://localhost:8000/auth",{ 
        method: 'post', 
        headers: myHeaders,
        redirect: 'follow'
      }).then((response)=>{
          response.json().then((res) => {
            if(res.name != "c001"){
              swal.fire('Access Denied', 'Login to view this page', 'error');
              this.router.navigate(['customerlogin']);
            }
          })
      })
  }
  vendorAuth(token){ 
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    fetch("http://localhost:8000/auth",{ 
      method: 'post', 
      headers: myHeaders,
      redirect: 'follow'
    }).then((response)=>{
        response.json().then((res) => {
          if(res.name != "v001"){
            swal.fire('Access Denied', 'Login to view this page', 'error');
            this.router.navigate(['vendorlogin']);
          }
        })
    })
  }
  employeeAuth(token){ 
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    fetch("http://localhost:8000/auth",{ 
      method: 'post', 
      headers: myHeaders,
      redirect: 'follow'
    }).then((response)=>{
        response.json().then((res) => {
          if(res.name != "e001"){
            swal.fire('Access Denied', 'Login to view this page', 'error');
            this.router.navigate(['employeelogin']);
          }
        })
    })
  }
  maintenanceAuth(token){ 
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    fetch("http://localhost:8000/auth",{ 
      method: 'post', 
      headers: myHeaders,
      redirect: 'follow'
    }).then((response)=>{
        response.json().then((res) => {
          if(res.name != "m001"){
            swal.fire('Access Denied', 'Login to view this page', 'error');
            this.router.navigate(['maintenancelogin']);
          }
        })
    })
  }
  shopfloorAuth(token){ 
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    fetch("http://localhost:8000/auth",{ 
      method: 'post', 
      headers: myHeaders,
      redirect: 'follow'
    }).then((response)=>{
        response.json().then((res) => {
          if(res.name != "p001"){
            swal.fire('Access Denied', 'Login to view this page', 'error');
            this.router.navigate(['shopfloorlogin']);
          }
        })
    })
  }
  ehsmAuth(token){ 
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    fetch("http://localhost:8000/auth",{ 
      method: 'post', 
      headers: myHeaders,
      redirect: 'follow'
    }).then((response)=>{
        response.json().then((res) => {
          if(res.name != "s001"){
            swal.fire('Access Denied', 'Login to view this page', 'error');
            this.router.navigate(['ehsmlogin']);
          }
        })
    })
  }
  qualityAuth(token){ 
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    fetch("http://localhost:8000/auth",{ 
      method: 'post', 
      headers: myHeaders,
      redirect: 'follow'
    }).then((response)=>{
        response.json().then((res) => {
          if(res.name != "q001"){
            swal.fire('Access Denied', 'Login to view this page', 'error');
            this.router.navigate(['qualitylogin']);
          }
        })
    })
  }
}
