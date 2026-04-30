import { Component, inject, signal } from '@angular/core';
import { EventService } from '../../services/event';
import { EventModel } from '../../models/event.model';
import { NgFor } from '@angular/common';
import { ActivityItemComponent } from '../activity-item/activity-item';
@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [NgFor, ActivityItemComponent],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss',
})
export class ActivityListComponent {
  private eventService = inject(EventService);
  events = signal<EventModel[]>([]);
  constructor() {
    this.loadEvents();
  }
  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (data) => this.events.set(data),
      error: (err) => {
        console.error('Błąd podczas pobierania eventów', err);
      },
    });
  }
}
