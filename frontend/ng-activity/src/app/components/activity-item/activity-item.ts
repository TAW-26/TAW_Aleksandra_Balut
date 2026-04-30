import { Component, Input, inject, signal, computed, Output, EventEmitter } from '@angular/core';
import { EventModel } from '../../models/event.model';
import { ActivityItemTextComponent } from '../activity-item-text/activity-item-text';
import { ActivityItemImageComponent } from '../activity-item-image/activity-item-image';
import { AuthService } from '../../services/auth';
import { EventService } from '../../services/event';
import { NgIf, NgClass } from '@angular/common';
@Component({
  selector: 'app-activity-item',
  standalone: true,
  imports: [
    ActivityItemTextComponent,
    ActivityItemImageComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './activity-item.html',
  styleUrl: './activity-item.scss'
})
export class ActivityItemComponent {
  @Output() updated = new EventEmitter<EventModel>();
  event = signal<EventModel | null>(null);
  @Input() set eventInput(value: EventModel) {
    this.event.set(value);
  }
  auth = inject(AuthService);
  eventService = inject(EventService);
  isLoggedIn = computed(() => this.auth.isLoggedIn());
  currentUserId = computed(() => this.auth.user()?.id);
  isLiked = computed(() =>
    this.event()?.likes?.includes(this.currentUserId() || '') ?? false
  );
  isJoined = computed(() =>
    this.event()?.participants?.includes(this.currentUserId() || '') ?? false
  );
  isOwner = computed(() =>
    this.event()?.creatorId === this.currentUserId()
  );
  join(event: MouseEvent) {
    event.stopPropagation();
    if (!this.event()) return;
    this.eventService.joinEvent(this.event()!._id).subscribe({
      next: (res: { event: EventModel }) => {
        this.event.update(e => ({
          ...e!,
          participants: res.event.participants
        }));
      }
    });
  }
  leave(event: MouseEvent) {
    event.stopPropagation();
    if (!this.event()) return;
    this.eventService.leaveEvent(this.event()!._id).subscribe({
      next: (res: { event: EventModel }) => {
        this.event.update(e => ({
          ...e!,
          participants: res.event.participants
        }));
      }
    });
  }
  toggleLike(event: MouseEvent) {
    event.stopPropagation();
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
}
