import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MedicineEvents } from './app.component';
import { postMedicineEvents } from './app.component';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private URL = 'http://localhost:3000/events'
  constructor(private http : HttpClient) { }

  getAllEvents():Observable<MedicineEvents[]>{
    return this.http.get<MedicineEvents[]>(`${this.URL}`)
  }

  postEvents(data : postMedicineEvents){
    return this.http.post(`${this.URL}`,data)
  }
}
