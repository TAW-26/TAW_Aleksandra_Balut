import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event';
import { EventModel } from '../../models/event.model';
import { NgFor, NgIf } from '@angular/common';
import { ActivityItemComponent } from '../activity-item/activity-item';
@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ActivityItemComponent],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss',
})
export class ActivityListComponent {
  private eventService = inject(EventService);
  events = signal<EventModel[]>([]);
  search = signal('');
  category = signal('');
  date = signal('');
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
  applyFilters() {
    this.eventService.getFilteredEvents({
      search: this.search(),
      category: this.category(),
      date: this.date()
    }).subscribe({
      next: (data) => this.events.set(data),
      error: (err) => console.error(err),
    });
  }
}
