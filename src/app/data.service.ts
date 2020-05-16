import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  // hello(name) {
  //   console.log("Hello",name);
  // }
  // countries() {
  //   return fetch('https://www.restcountries.eu/rest/v2/all');
  // }
  getData(requestOptions) {
     return fetch("http://localhost:8000/login",requestOptions);
  }
 
}
