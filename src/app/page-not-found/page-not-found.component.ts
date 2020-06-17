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
  sampleArray : any;
  constructor(private data:DataService) { }

 ngOnInit(): void {
    this.onClick = () => {
      
      let objnr = (document.getElementById("vendorID") as HTMLInputElement).value;
      
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({"objnr": objnr});
      const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
       this.data.getData(requestOptions).then((response)=>{
         response.json().then((result)=>{
           console.log(result);
           this.sampleArray = result;
           console.log(this.sampleArray);
           console.log(result[0]['OBJNR']['_text']);
           console.log(this.sampleArray[0]['OBJNR']['_text']);
           alert("Check console!!");
         })
       })
        
        
    
    }
  }
 

}
