import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  countries:Object;
  
  // onChange(event){
  //    console.log(event.target.value);
  // }
  
  onClick: Function;
  constructor(private data:DataService) { }

 ngOnInit(): void {
    this.onClick = () => {
      
        let input = ((document.getElementById("vendorID") as HTMLInputElement));
        let button = (document.querySelector('#search') as HTMLButtonElement);
        let para = (document.querySelector('#hello') as HTMLParagraphElement);
        console.log(input.value);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const id = input.value;
      const raw = JSON.stringify({vendId: id});
      const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
       this.data.getData(requestOptions).then((response)=>{
         response.json().then((result)=>{
           console.log(result);
           para.textContent = `${result.vendorAddr} is the vendor address, and his name is ${result.vendorName}`;
         })
       })
        
        
    
    }
  }
 

}
