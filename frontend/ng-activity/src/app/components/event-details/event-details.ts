import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event';
import { AuthService } from '../../services/auth';
import { EventModel } from '../../models/event.model';
import { UserService } from '../../services/user';
@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss'
})
export class EventDetailsComponent {
  route = inject(ActivatedRoute);
  eventService = inject(EventService);
  auth = inject(AuthService);
  userService = inject(UserService);
  event = signal<EventModel | null>(null);
  organizer = signal<{ id: string; username: string; email: string } | null>(null);
  currentUserId = computed(() => this.auth.user()?.id);
  isLoggedIn = computed(() => this.auth.isLoggedIn());
  isOwner = computed(() =>
    this.event()?.creatorId === this.currentUserId()
  );
  isJoined = computed(() =>
    this.event()?.participants?.includes(this.currentUserId() || '') ?? false
  );
  isLiked = computed(() =>
    this.event()?.likes?.includes(this.currentUserId() || '') ?? false
  );
  daysLeft = computed(() => {
    const dateStr = this.event()?.date;
    if (!dateStr) return 0;
    const eventDate = new Date(dateStr);
    const today = new Date();
    return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  });
  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadEvent(id);
  }
  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event.set(data);
        // Pobierz dane organizatora
        this.userService.getUser(data.creatorId).subscribe({
          next: user => this.organizer.set(user),
          error: err => console.error(err)
        });
      }
    });
  }
  join() {
    if (!this.event()) return;
    this.eventService.joinEvent(this.event()!._id).subscribe({
      next: (res: any) => {
        this.event.update(e => ({
          ...e!, participants: res.event.participants
        }
        ));
      }
    });
  }
  leave() {
    if (!this.event()) return;
    this.eventService.leaveEvent(this.event()!._id).subscribe({
      next: (res: any) => {
        this.event.update(e => ({
          ...e!, participants: res.event.participants
        }
        ));
      }
    });
  }
  toggleLike() {
    if (!this.event()) return;
    this.eventService.toggleLike(this.event()!._id).subscribe({
      next: () => {
        const userId = this.currentUserId();
        if (!userId) return;
        const updatedLikes = this.isLiked()
          ? this.event()!.likes.filter(id => id !== userId)
          : [...this.event()!.likes, userId];
        this.event.update(e => ({
          ...e!,
          likes: updatedLikes
        }));
      }
    });
  }
  deleteEvent() {
    if (!this.event()) return;
    const confirmed = confirm('Czy na pewno chcesz usunąć to wydarzenie?');
    if (!confirmed) return;
    const id = this.event()!._id;
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        alert('Wydarzenie zostało usunięte.');
        window.location.href = '/'; 
      },
      error: (err) => console.error(err)
    });
  }
}
