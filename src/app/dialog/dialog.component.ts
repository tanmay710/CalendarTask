import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventsService } from '../events.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  @Output()
  eventDeleted : EventEmitter<string> = new EventEmitter<string>()

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data, private service : EventsService,public dialogRef: MatDialogRef<DialogComponent>){}
  deleteEvent(){
    const deleteEvent = confirm("Are you sure you want to delete")
    if(deleteEvent){
      this.service.deleteEvent(this.data.event.id).subscribe({
        next : () => {alert("Successfully deleted the data"),
          this.dialogRef.close()
        }
      })
      this.eventDeleted.emit(this.data.event.id)
    }
  }
}

export interface Data{
  event :{
    id : string,
    title : string
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