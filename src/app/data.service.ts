import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private router:Router) { }
  // hello(name) {
  //   console.log("Hello",name);
  // }
  // countries() {
  //   return fetch('https://www.restcountries.eu/rest/v2/all');
  // }
 
  getData(requestOptions) {
     return fetch("http://localhost:8000/login",requestOptions);
  }

  login(options) {
    return fetch("http://localhost:8000/users/login",options);
  }

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
}
