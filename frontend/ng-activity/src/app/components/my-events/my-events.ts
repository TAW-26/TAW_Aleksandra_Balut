import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';
import { AuthService } from '../../services/auth';
import { ActivityItemComponent } from '../activity-item/activity-item';
import { EventModel } from '../../models/event.model';
@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, ActivityItemComponent],
  templateUrl: './my-events.html',
  styleUrl: './my-events.scss'
})
export class MyEventsComponent {
  eventService = inject(EventService);
  auth = inject(AuthService);
  events = signal<EventModel[]>([]);
  currentUserId = computed(() => this.auth.user()?.id);
  createdEvents = computed(() =>
    this.events().filter(ev => ev.creatorId === this.currentUserId())
  );
  favoriteEvents = computed(() =>
    this.events().filter(ev => ev.likes?.includes(this.currentUserId() || ''))
  );
  constructor() {
    this.loadEvents();
  }
  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: data => this.events.set(data),
      error: err => console.error(err)
    });
  }
  refreshEvent(updated: EventModel) {
    this.events.update(list =>
      list.map(ev => ev._id === updated._id ? updated : ev)
    );
  }
  joinedEvents = computed(() =>
    this.events().filter(ev =>
      ev.participants?.includes(this.currentUserId() || '')
    )
  );
}
