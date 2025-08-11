import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule'
import { DialogComponent } from './dialog/dialog.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { EventsService } from './events.service';
import { TableComponent } from './table/table.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  addevent : FormGroup

   constructor(private dialog : MatDialog, private fb : FormBuilder, private service : EventsService){
    this.addevent = this.fb.group({
      name  : ['',Validators.required],
      interval : ['',Validators.required],
      frequency : ['',Validators.required],
      startDate : ['',Validators.required],
      endDate : ['',Validators.required]
    })
   }



  // color = '#F5E7E4'

  isVisible : boolean = false
  calendarView : string = 'dayGridMonths'
  start1 : string = ''
  end1 : string = ''
  dosage : string =''
  frequency1 : string = ''
  interval1 : number = 0
  notes : string = ''
  eventId : number = 0


  frequenc : Frequency[] = [
    {value : 'daily', viewValue : 'daily'},
    {value : 'weekly', viewValue : 'weekly'}
  ]

  inputMedicineEvent : postMedicineEvents={
    title: '',
    rrule :{
      freq: '',
      interval: 0,
      dtstart: '',
      until: ''
    }
  
  }

  AllEvents : ShowEvents[]=[]
  // displayedColumns : string[] = ['ID', 'Medicine name','Frequency','Interval','Start','Until']


  @ViewChild('calendar') fullCalendar : FullCalendarComponent
  @ViewChild(TableComponent) table : TableComponent
  /**
   Initializing the dialog box
  */
 

  /**
  * Loading the previously added events 
  * Get all the events from localstorage and store it in @storedevents
  *  @retrivedEvents existing events is updated using spread operator(we want to pass elements as individual arguments)
 */

  ngOnInit(): void {
    this.service.getAllEvents().subscribe((data)=>{
      const storedEvents = data
      if(storedEvents){
        this.calendarOptions.events = [...storedEvents]
      }
    })
    this.viewEvents()
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin,rrulePlugin],
    headerToolbar: {
      left: '',
      center: 'prev,title,next',
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

  /**
   * Handling the click on a specific event by passing event details and opening the dialog box
   * @param eventInfo provided from @eventClick passes all the data
   */
  handleClickEvent(eventInfo : EventClickArg){    
    this.dialog.open(DialogComponent,{data:eventInfo});
  }

  /**
   * @isVisible value is changed to true on event click from template so that form is displayed
   */
  showForm(){ 
    this.isVisible = true
  }

  /**
   * @isVisible is turned to false to close the form, different function is used because separate button is provided inside the form itself
   */
  closeForm(){
    this.isVisible = false
  }

  /**
   * Handle the event form submit event
   * @newDate provides us the exact required start date format we need to pass in Full calendar
   * @inputMedicineEvent Values passed to the empty object created in the same format as Full calendar events expects 
   * New event is then emptied with its id incremented(id in calendar event is a string)
   */

  onSubmit(){ 
    if(this.addevent.valid){
    this.eventId = this.eventId+1
    this.start1 = this.addevent.get('startDate').value
    const date = new Date(this.start1)  
    date.setDate(date.getDate()+1)
    
    let newDate = date.toISOString().slice(0,19)
    this.end1 = this.addevent.get('endDate').value    
    const date2 = new Date(this.end1)
    this.inputMedicineEvent.title = this.addevent.get('name').value   
    this.inputMedicineEvent.rrule.dtstart = newDate
    this.inputMedicineEvent.rrule.until = formatDate(date2,'yyyy-MM-dd','en-US') 
    this.inputMedicineEvent.rrule.freq = this.frequency1
    this.inputMedicineEvent.rrule.interval = this.addevent.get('interval').value

      
      this.service.postEvents(this.inputMedicineEvent).subscribe({
        next : (newEvent) => {alert("successfully added to json"),
          this.calendarOptions.events = [...this.calendarOptions.events as MedicineEvents[],newEvent]
        }
      }
      )

    this.inputMedicineEvent={
     title : '',
      rrule :{
        freq: '',
        interval: 0,
        dtstart: '',
        until: ''
      }
    } 
    this.start1 = ''
    this.end1 = ''
    this.interval1 = 0
    this.frequency1 = ''

    }
  }

  /**
   * 
   * @param freq parameter which we receive from view, give this value to @frequency1 which will be added in event 
   */
  onFrequencySelect(freq : string){
    this.frequency1 = freq
  }

  /**
   * Handling the radio button to change the view
   * @param view is the input coming from change event in radio button
   */

  changeView(view : string){
    this.calendarView = view
    if(this.calendarView !== 'listView'){
      this.fullCalendar.getApi().changeView(view)
    }
    else{
      this.table.calendarView = view
    }
    
  }

  /**
   * This is to show and provide all events to display in table inside List View
   */
  viewEvents(){
    this.service.getAllEvents().subscribe((data)=>{
      const storedData = data
      if(storedData){
    
      this.AllEvents = storedData.map((items)=>({
        id : items.id,
        title : items.title,
        frequency : items.rrule.freq,
        interval : items.rrule.interval,
        start : items.rrule.dtstart,
        until : items.rrule.until
      }))
    }
    })
    
    
  
    
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


export interface postMedicineEvents{
 
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

interface Frequency{
  value : string,
  viewValue : string
}

