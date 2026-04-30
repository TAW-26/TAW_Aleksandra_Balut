import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventModel } from '../models/event.model';
@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3100/api/events';
  getAllEvents() {
    return this.http.get<EventModel[]>(this.baseUrl);
  }
  getEventById(id: string) {
    return this.http.get<EventModel>(`${this.baseUrl}/${id}`);
  }
  createEvent(data: Partial<EventModel>) {
    return this.http.post<EventModel>(this.baseUrl, data);
  }
  updateEvent(id: string, data: Partial<EventModel>) {
    return this.http.put<EventModel>(`${this.baseUrl}/${id}`, data);
  }
  deleteEvent(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  joinEvent(id: string) {
    return this.http.post(`${this.baseUrl}/${id}/join`, {});
  }
  leaveEvent(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}/join`);
  }
  toggleLike(id: string) {
    return this.http.post(`${this.baseUrl}/${id}/like`, {});
  }
}
