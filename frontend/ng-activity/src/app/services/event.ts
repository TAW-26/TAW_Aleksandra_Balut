import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventModel } from '../models/event.model';

import { Observable } from 'rxjs';
// ...
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
joinEvent(id: string): Observable < { event: EventModel } > {
  return this.http.post<{ event: EventModel }>(
    `${this.baseUrl}/${id}/join`,
    {}
  );
}
leaveEvent(id: string): Observable < { event: EventModel } > {
  return this.http.delete<{ event: EventModel }>(
    `${this.baseUrl}/${id}/join`
  );
}
toggleLike(id: string): Observable < { message: string; likesCount: number } > {
  return this.http.post<{ message: string; likesCount: number }>(
    `${this.baseUrl}/${id}/like`,
    {}
  );
}

  getFilteredEvents(params: { category?: string; search?: string; dateFrom?: string; dateTo?: string }) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.dateFrom) query.append('dateFrom', params.dateFrom);
    if (params.dateTo) query.append('dateTo', params.dateTo);
    return this.http.get<EventModel[]>(`${this.baseUrl}?${query.toString()}`);
  }
  removeParticipant(eventId: string, userId: string) {
    return this.http.delete<{ event: EventModel }>(
      `${this.baseUrl}/${eventId}/participants/${userId}`
    );
  }

}
