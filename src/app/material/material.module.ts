import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

const MaterialComponents = [
     MatButtonModule ,
     MatSliderModule ,
     MatToolbarModule
];


@NgModule({
  
  imports: [
   MaterialComponents
  ],
  exports: [
    MaterialComponents
  ]
})
export class MaterialModule { }
