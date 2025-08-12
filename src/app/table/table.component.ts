import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ShowEvents } from '../app.component';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges{
  @Input() 
  AllEvents : ShowEvents[]

  filter : ShowEvents[] 

  search : string = ''
  calendarView : string = ''
  displayedColumns : string[] = ['ID', 'Medicine name','Dosage','Frequency','Interval','Start','Notes']
  
  notPresent : boolean = false
  color = '#F5E7E4'

  constructor(){
    
  }

  ngOnInit(): void {  
    this.filter = this.AllEvents
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.filter = this.AllEvents
    console.log(this.AllEvents);
    
  }
  

  onChange(){
    console.log(this.search);

    if(!this.search){
          this.filter = this.AllEvents
        this.notPresent = false
    }
    else{
      this.filter = this.AllEvents.filter((p)=> p.title.toLowerCase().includes(this.search.toLowerCase()))
    }
    if(this.search && this.filter.length ===0){
      this.notPresent = true
    }
   
  }

}
