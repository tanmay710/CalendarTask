import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule'
import { DialogComponent } from './dialog/dialog.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventsService } from './events.service';
import { TableComponent } from './table/table.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  addevent: FormGroup

  constructor(private dialog: MatDialog, private fb: FormBuilder, private service: EventsService) {
    this.addevent = this.fb.group({
      name: ['', Validators.required],
      interval: ['', Validators.required],
      frequency: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      dosage: ['',Validators.required],
      notes: ['',Validators.required]
    })
  }

  isVisible: boolean = false
  calendarView: string = 'dayGridMonths'
  start1: string = ''
  end1: string = ''
  dosage: string = ''
  frequency1: string = ''
  interval1: number = 0
  notes: string = ''
  eventId: number = 1


  frequenc : Frequency[] = [
    {value : 'daily', viewValue : 'daily'},
    {value : 'weekly', viewValue : 'weekly'}
  ]


  AllEvents : ShowEvents[]=[]



  @ViewChild('calendar') fullCalendar: FullCalendarComponent
  @ViewChild(TableComponent) table: TableComponent
  /**
   Initializing the dialog box
  */


  /**
  * Loading the previously added events 
 */

  ngOnInit(): void {
    this.service.getAllEvents().subscribe((data) => {

      if (data) {
        this.calendarOptions.events = [...data]
      }
    })
    // this.viewEvents()

  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, rrulePlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    events: [],
    eventContent: function (args) {
    
      
      let eventHtml = ''
      let date = new Date(args.event.start)
      let date2 = formatDate(date, 'yyyy-MM-dd', 'en-US')

      if (args.view.type === 'dayGridMonth') {
        eventHtml = `<div>Medicine Name : ${args.event.title}</div>`
      }
      else {
        eventHtml = `<div>Medicine Name ${args.event.title}<br> 
        Frequency : ${args.event.extendedProps['frequency']}<br>
        Date: ${date2}<br>
        Dosage: ${args.event.extendedProps['dosage']} </div>`
      }
      return { html: eventHtml };
    },

    eventClick: this.handleClickEvent.bind(this),
     eventAdd : ()=> this.viewEvents(),
    eventRemove: () => this.handleRemovedEvent()
  };

  /**
   * Handling the click on a specific event by passing event details and opening the dialog box
   * @param eventInfo provided from @eventClick passes all the data
   */
  handleClickEvent(eventInfo: EventClickArg) {

    console.log(eventInfo);

    const eventI : ShowEvents ={
      id: eventInfo.event.id,
      title: eventInfo.event.title,
      frequency: eventInfo.event._def.extendedProps['frequency'],
      dosage: eventInfo.event._def.extendedProps['dosage'],
      interval: eventInfo.event._def.extendedProps['interval'],
      start: eventInfo.event.start.toISOString().split('T')[0],
      notes: eventInfo.event._def.extendedProps['notes']
    }


    const dialogRef = this.dialog.open(DialogComponent, { data: eventI });
    dialogRef.componentInstance.eventDeleted.subscribe((data) => {
      const storedEvents = this.calendarOptions.events as MedicineEvents[]
      const newEventsArray = storedEvents.filter((p) => p.id !== eventInfo.event._def.publicId)
      this.calendarOptions.events = [...newEventsArray]
    })
  }

  handleRemovedEvent() {
    this.service.getAllEvents().subscribe((data) => {
      const storedData = data

        if(storedData){

        this.AllEvents = storedData.map((items)=>({
          id : items.id,
          title : items.title,
          frequency : items.frequency,
          interval : items.interval,
          start : items.start,
          dosage : items.dosage,
          notes : items.notes
        }))
      }
    })
  }

  /**
   * @isVisible value is changed to true on event click from template so that form is displayed
   */
  showForm() {
    this.isVisible = true
  }

  /**
   * @isVisible is turned to false to close the form, different function is used because separate button is provided inside the form itself
   */
  closeForm() {
    this.isVisible = false
  }

  /**
   * Handle the event form submit event
   * @newDate provides us the exact required start date format we need to pass in Full calendar
   * @inputMedicineEvent Values passed to the empty object created in the same format as Full calendar events expects 
   * New event is then emptied with its id incremented(id in calendar event is a string)
   */

  onSubmit() {
    if (this.addevent.valid) {

      this.start1 = this.addevent.get('startDate').value
      const date = new Date(this.start1)
      const date2 = date.setDate(date.getDate() + 1)
      this.end1 = this.addevent.get('endDate').value
      const endDate = new Date(this.end1)

      let currentDate = new Date(date2)
      while (currentDate <= endDate) {
        let elements = this.calendarOptions.events as MedicineEvents[]
        let lastElement = elements[elements.length - 1]
        if (lastElement) {
          let fetchid = lastElement.id
          this.eventId = +fetchid + 1
        }
        const eventObj: postMedicineEvents = {
          id: this.eventId.toString(),
          title: this.addevent.get('name').value,
          dosage: this.addevent.get('dosage').value,
          start: currentDate.toISOString().split('T')[0],
          notes: this.addevent.get('notes').value,
          frequency: this.frequency1,
          interval : this.addevent.get('interval').value
        }

        this.service.postEvents(eventObj).subscribe({
          next: (event) => {
            
            this.calendarOptions.events = [...this.calendarOptions.events as MedicineEvents[], event]
          }
        })
        this.eventId++
        currentDate.setDate(currentDate.getDate() + 1)
      }
      this.addevent.reset()
      this.start1 = ''
      this.end1 = ''
      this.interval1 = 0
      this.frequency1 = ''

    }
  }

  /**
   * Giving value to frequency
   * @param freq parameter which we receive from view, give this value to @frequency1 which will be added in event 
   */
  onFrequencySelect(freq: string) {
    this.frequency1 = freq
  }

  /**
   * Handling the radio button to change the view
   * @param view is the input coming from change event in radio button
   */

  changeView(view: string) {
    this.calendarView = view
    if (this.calendarView !== 'listView') {
      this.fullCalendar.getApi().changeView(view)
    }
    else {
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
        dosage : items.dosage,
        start : items.start,
        frequency : items.frequency,
        interval : items.interval,
        notes : items.notes
      }))
    }
    })  
  }
}


export interface MedicineEvents {
  id: string,
  title: string,
  dosage: string,
  start: string,
  frequency : string,
  interval : number,
  notes: string
}


export interface postMedicineEvents {
  id: string,
  title: string,
  dosage: string,
  start: string,
  frequency : string,
  interval : number,
  notes: string
}

export interface ShowEvents{
  id : string,
  title : string,
  frequency : string,
  dosage : string,
  interval : number,
  start : string,
  notes : string
}

interface Frequency{
  value : string,
  viewValue : string
}

