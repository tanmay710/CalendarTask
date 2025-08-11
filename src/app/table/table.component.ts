import { Component, Input } from '@angular/core';
import { ShowEvents } from '../app.component';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() 
  AllEvents : ShowEvents[]

  calendarView : string = ''
  displayedColumns : string[] = ['ID', 'Medicine name','Frequency','Interval','Start','Until']

  color = '#F5E7E4'
}
