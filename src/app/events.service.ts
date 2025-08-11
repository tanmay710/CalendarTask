import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MedicineEvents } from './app.component';
import { postMedicineEvents } from './app.component';
import { Observable, retry, shareReplay } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private URL = 'http://localhost:3000/events'
  constructor(private http : HttpClient) { }

  private events$ : Observable<MedicineEvents[]>


  /**
   * Fetches all the data from json server provided 
   * Uses caching so that api is not called again
   */
  getAllEvents():Observable<MedicineEvents[]>{
    if(!this.events$){
      this.events$ = this.http.get<MedicineEvents[]>(`${this.URL}`)
      shareReplay(1)
    } 
    return this.events$

    
  }

  /**
   * This function posts data to json our local json server
   * @param data Data from @addevent form after submitting
   */
  postEvents(data : postMedicineEvents){
    return this.http.post(`${this.URL}`,data)
  }
}
