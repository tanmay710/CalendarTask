import { formatDate } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule'
import { DialogComponent } from './dialog/dialog.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  color = '#F5E7E4'

  isVisible : boolean = false
  calendarView : string = 'dayGridMonths'
  start1 : string = ''
  end1 : string = ''
  dosage : string =''
  frequency1 : string = ''
  interval1 : number = 0
  notes : string = ''
  eventId : number = 1



  inputMedicineEvent : MedicineEvents={
    id : this.eventId.toString(),
    title: '',
    rrule :{
      freq: '',
      interval: 0,
      dtstart: '',
      until: ''
    }
  
  }

  AllEvents : ShowEvents[]=[]
  displayedColumns : string[] = ['ID', 'Medicine name','Frequency','Interval','Start','Until']


  @ViewChild('calendar') fullCalendar : FullCalendarComponent

  constructor(private dialog : MatDialog){}

  ngOnInit(): void {
    const storedEvents = localStorage.getItem('event')
    if(storedEvents){
      const retrievedEvents :  MedicineEvents[] = JSON.parse(storedEvents)
      this.calendarOptions.events = [...retrievedEvents]
    }
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin,rrulePlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    events: [],
    eventContent : function(args){
      let eventHtml =''
      let date = new Date(args.event._def.recurringDef.typeData.rruleSet._rrule[0].options.dtstart)
      let date2 = formatDate(date,'yyyy-MM-dd','en-US')
      let date3 = new Date(args.event._def.recurringDef.typeData.rruleSet._rrule[0].options.until )
      let date4 = formatDate(date3,'yyyy-MM-dd','en-US')
      if(args.view.type === 'dayGridMonth'){
        eventHtml = `<div>Medicine Name : ${args.event.title}</div>`
      }
      else{
        eventHtml = `<div>Medicine Name ${args.event.title}<br> 
        Frequency : ${args.event._def.recurringDef.typeData.rruleSet._rrule[0].options.freq}<br>
        Start date: ${date2}<br>
        End date: ${date4} </div>`  
      }
       return { html: eventHtml };
    },
  
     eventClick : this.handleClickEvent.bind(this),
     eventAdd : ()=> this.viewEvents()
  };

  handleClickEvent(eventInfo : EventClickArg){    
    this.dialog.open(DialogComponent,{data:eventInfo});
  }

  showForm(){ 
    this.isVisible = true
  }
  closeForm(){
    this.isVisible = false
  }

  onSubmit(){ 
    const date = new Date(this.start1)  
    date.setDate(date.getDate()+1)
    
    let newDate = date.toISOString().slice(0,19)    
    const date2 = new Date(this.end1)   
    this.inputMedicineEvent.rrule.dtstart = newDate
    this.inputMedicineEvent.rrule.until = formatDate(date2,'yyyy-MM-dd','en-US') 
    this.inputMedicineEvent.rrule.freq = this.frequency1
    this.inputMedicineEvent.rrule.interval = this.interval1

    const currEvents = this.calendarOptions.events as MedicineEvents[]
    currEvents.push(this.inputMedicineEvent)
    this.calendarOptions.events = [...currEvents]
    localStorage.setItem('event',JSON.stringify(currEvents))
    
    this.inputMedicineEvent={
     id : (this.eventId).toString(),
     title : '',
      rrule :{
        freq: '',
        interval: 0,
        dtstart: '',
        until: ''
      }
    }
    this.eventId = this.eventId +1 
    this.start1 = ''
    this.end1 = ''
    this.interval1 = 0
    this.frequency1 = ''

  
    
  }

  changeView(view : string){
    this.calendarView = view
    if(this.calendarView !== 'listView'){
      this.fullCalendar.getApi().changeView(view)
    }
  }

  viewEvents(){
    const storedData = localStorage.getItem('event')
    if(storedData){
      const storedData2 = JSON.parse(storedData)
      this.AllEvents = storedData2.map((items)=>({
        id : items.id,
        title : items.title,
        frequency : items.rrule.freq,
        interval : items.rrule.interval,
        start : items.rrule.dtstart,
        until : items.rrule.until
      }))
    }
    
  
    
  }

}

export interface MedicineEvents{
  id : string,
  title : string,
  rrule :{
    freq : string,
    interval : number,
    dtstart : string,
    until : string
  }
  

}

export interface ShowEvents{
  id : string,
  title : string,
  frequency : string,
  interval : number,
  start : string,
  until : string
}


