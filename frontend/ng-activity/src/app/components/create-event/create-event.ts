import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.scss'
})
export class CreateEventComponent {
  fb = inject(FormBuilder);
  eventService = inject(EventService);
  router = inject(Router);
  categories = ['sport', 'gry', 'dzieci', 'spotkania'] as const;
  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    location: ['', Validators.required],
    maxParticipants: [10, Validators.required],
    category: ['', Validators.required]
  });
  goBack() {
    this.router.navigate(['/']);
  }
  submit() {
    if (this.form.invalid) return;
    const payload = {
      ...this.form.value,
      title: this.form.value.title ?? '',
      description: this.form.value.description ?? '',
      date: this.form.value.date ?? '',
      location: this.form.value.location ?? '',
      maxParticipants: this.form.value.maxParticipants ?? 0,
      category: this.form.value.category as (typeof this.categories)[number]
    };
    this.eventService.createEvent(payload).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error(err)
    });
  }
}
