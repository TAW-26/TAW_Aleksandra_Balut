import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event';
import { EventModel } from '../../models/event.model';
import { ActivityItemComponent } from '../activity-item/activity-item';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [FormsModule, RouterModule, ActivityItemComponent],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss',
})
export class ActivityListComponent {
  private eventService = inject(EventService);

  events = signal<EventModel[]>([]);
  search = signal('');
  category = signal('');
  dateFrom = signal('');
  dateTo = signal('');

  constructor() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.events.set(sorted);
      },
      error: (err) => {
        console.error('Błąd podczas pobierania eventów', err);
      },
    });
  }

  applyFilters() {
    this.eventService.getFilteredEvents({
      search: this.search(),
      category: this.category(),
      dateFrom: this.dateFrom(),
      dateTo: this.dateTo()
    }).subscribe({
      next: (data) => {
        const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.events.set(sorted);
      },
      error: (err) => console.error(err),
    });
  }
}
