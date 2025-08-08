import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Data){

    
  }
}

export interface Data{
  event :{
    title,
    _def :{
      recurringDef:{
        typeData :{
          rruleSet :{
            _rrule : {
              options :{
                dtstart : string,
                freq : number,
                interval : number,
                until :string
              }
            }
          }
        }
      }
    }
  }
}