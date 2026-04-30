import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event';
import { EventModel } from '../../models/event.model';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-edit.html',
  styleUrl: './event-edit.scss'
})
export class EventEditComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  eventService = inject(EventService);
  auth = inject(AuthService);
  event = signal<EventModel | null>(null);
  userService = inject(UserService);
  participants = signal<{ id: string; username: string; email: string }[]>([]);

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    location: ['', Validators.required],
    maxParticipants: [10, Validators.required],
    category: ['', Validators.required]
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadEvent(id);
  }
  formatDate(dateStr: string) {
    const d = new Date(dateStr);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: data => {
        this.event.set({
          ...data,
          participants: data.participants ?? []
        });
        this.form.patchValue({
          title: data.title,
          description: data.description,
          date: this.formatDate(data.date),
          location: data.location,
          maxParticipants: data.maxParticipants,
          category: data.category
        });
        const participantIds = data.participants ?? [];
        if (participantIds.length > 0) {
          Promise.all(
            participantIds.map(uid =>
              this.userService.getUser(uid).toPromise()
            )
          ).then(users => {
            this.participants.set(
              users.map(u => ({
                id: u!.id,
                username: u!.username,
                email: u!.email
              }))
            );
          });
        } else {
          this.participants.set([]);
        }
      }
    });
  }
  save() {
    if (!this.event()) return;
    if (this.form.invalid) return;
    const id = this.event()!._id;
    const payload = {
      title: this.form.value.title ?? '',
      description: this.form.value.description ?? '',
      date: this.form.value.date ?? '',
      location: this.form.value.location ?? '',
      maxParticipants: this.form.value.maxParticipants ?? 0,
      category: this.form.value.category as EventModel['category']
    };
    this.eventService.updateEvent(id, payload).subscribe({
      next: () => this.router.navigate(['/event', id]),
      error: err => console.error(err)
    });
  }
  cancel() {
    if (!this.event()) return;
    this.router.navigate(['/event', this.event()!._id]);
  }
  removeParticipant(userId: string) {
    if (!confirm('Czy na pewno chcesz usunąć uczestnika z wydarzenia?')) {
      return;
    }
    if (!this.event()) return;
    const eventId = this.event()!._id;
    this.eventService.removeParticipant(eventId, userId).subscribe({
      next: (res) => {
        // odśwież listę ID w evencie
        this.event.update(e => ({
          ...e!,
          participants: res.event.participants
        }));
        // odśwież listę danych użytkowników
        this.participants.update(list =>
          list.filter(p => p.id !== userId)
        );
      },
      error: err => console.error(err)
    });
  }
}
