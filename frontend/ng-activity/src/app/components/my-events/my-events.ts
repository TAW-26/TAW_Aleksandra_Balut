import { Component, inject, signal, computed } from '@angular/core';
import { EventService } from '../../services/event';
import { AuthService } from '../../services/auth';
import { ActivityItemComponent } from '../activity-item/activity-item';
import { EventModel } from '../../models/event.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [ActivityItemComponent, RouterModule], 
  templateUrl: './my-events.html',
  styleUrl: './my-events.scss'
})
export class MyEventsComponent {
  eventService = inject(EventService);
  auth = inject(AuthService);
  isLoading = signal(true);
  events = signal<EventModel[]>([]);
  currentUserId = computed(() => this.auth.user()?.id);

  createdEvents = computed(() =>
    this.events().filter(ev => ev.creatorId === this.currentUserId())
  );

  favoriteEvents = computed(() =>
    this.events().filter(ev => ev.likes?.includes(this.currentUserId() || ''))
  );

  joinedEvents = computed(() =>
    this.events().filter(ev => ev.participants?.includes(this.currentUserId() || ''))
  );

  constructor() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading.set(true);
    this.eventService.getAllEvents().subscribe({
      next: data => {
        this.events.set(data);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Błąd pobierania wydarzeń:', err);
        this.isLoading.set(false);
      }
    });
  }

  refreshEvent(updated: EventModel) {
    this.events.update(list =>
      list.map(ev => ev._id === updated._id ? updated : ev)
    );
  }
}
