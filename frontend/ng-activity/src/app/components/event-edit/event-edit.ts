import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event';
import { EventModel } from '../../models/event.model';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-edit.html',
  styleUrl: './event-edit.scss'
})
export class EventEditComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  eventService = inject(EventService);
  auth = inject(AuthService);
  userService = inject(UserService);
  http = inject(HttpClient);
  platformId = inject(PLATFORM_ID);

  event = signal<EventModel | null>(null);
  participants = signal<{ id: string; username: string; email: string }[]>([]);
  userToDelete = signal<{ id: string; username: string } | null>(null);
  categories = ['sport', 'gry', 'dzieci', 'spotkania'] as const;

  map: any;
  marker: any;
  private L: any;

  private initialCoords: [number, number] = [50.013, 20.995];

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    locationName: ['', Validators.required],
    location: this.fb.group({
      type: ['Point'],
      coordinates: [[0, 0] as number[], Validators.required]
    }),
    maxParticipants: [10, Validators.required],
    category: ['', Validators.required]
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadEvent(id);
  }

  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      this.loadLeaflet();
    }
  }

  async loadLeaflet() {

    this.L = await import('leaflet');
    this.initMap();
  }

  initMap() {
    if (!this.L) return;

    const [lng, lat] = this.initialCoords;

    const DefaultIcon = this.L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    this.L.Marker.prototype.options.icon = DefaultIcon;

    this.map = this.L.map('map-edit').setView([lat, lng], 15);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = this.L.marker([lat, lng]).addTo(this.map);

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 200);

    this.map.on('click', (e: any) => {
      this.updateMarker(e.latlng.lat, e.latlng.lng);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
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
          locationName: data.locationName,
          location: {
            type: 'Point',
            coordinates: data.location?.coordinates ?? [0, 0]
          },
          maxParticipants: data.maxParticipants,
          category: data.category
        });

        const coords = data.location?.coordinates ?? [50.013, 20.995];
        this.initialCoords = [coords[0], coords[1]];

        if (this.map) {
          this.map.setView([coords[1], coords[0]], 15);
          this.updateMarker(coords[1], coords[0]);
        }

        const rawParticipants = data.participants ?? [];
        const participantIds: string[] = rawParticipants.map((p: any) =>
          typeof p === 'object' ? (p._id || p.id) : p
        );

        if (participantIds.length > 0) {
          Promise.all(
            participantIds.map(uid =>
              firstValueFrom(this.userService.getUser(uid))
            )
          ).then(users => {
            this.participants.set(
              users
                .filter(u => u !== null && u !== undefined)
                .map((u: any) => ({
                  id: u.id || u._id,
                  username: u.username || 'Nieznany użytkownik',
                  email: u.email || ''
                }))
            );
          }).catch(err => {
            console.error('Błąd pobierania danych szczegółowych uczestników:', err);
            this.participants.set([]);
          });
        } else {
          this.participants.set([]);
        }
      },
      error: err => console.error(err)
    });
  }

  searchAddress(query: string) {
    if (!query) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    this.http.get<any[]>(url).subscribe({
      next: (results) => {
        if (results && results.length > 0) {
          const place = results[0];
          const lat = parseFloat(place.lat);
          const lng = parseFloat(place.lon);

          if (this.map) {
            this.map.setView([lat, lng], 16);
            this.updateMarker(lat, lng);
          }

          this.form.patchValue({
            locationName: place.display_name,
            location: {
              type: 'Point',
              coordinates: [lng, lat]
            }
          });
        } else {
          alert('Nie znaleziono podanego adresu.');
        }
      },
      error: (err) => console.error(err)
    });
  }

  reverseGeocode(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.form.patchValue({
          locationName: res.display_name || `Współrzędne: ${lat}, ${lng}`,
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        });
      },
      error: (err) => console.error(err)
    });
  }

  updateMarker(lat: number, lng: number) {
    if (!this.L || !this.map) return;
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = this.L.marker([lat, lng]).addTo(this.map);
    }
  }

  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  save() {
    if (!this.event()) return;
    if (this.form.invalid) return;
    const id = this.event()!._id;
    const payload = {
      title: this.form.value.title ?? '',
      description: this.form.value.description ?? '',
      date: this.form.value.date ?? '',
      locationName: this.form.value.locationName ?? '',
      location: {
        type: 'Point' as const,
        coordinates: (this.form.value.location?.coordinates ?? [0, 0]) as [number, number]
      },
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
    console.log('Kliknięto kosz dla użytkownika o ID:', userId);

    const user = this.participants().find(p => p.id === userId || (p as any)._id === userId);

    if (user) {
      console.log('Znaleziono użytkownika do usunięcia:', user.username);
      this.userToDelete.set({ id: user.id, username: user.username });
    } else {
      console.error('Nie znaleziono użytkownika na liście participants dla ID:', userId);
      this.userToDelete.set({ id: userId, username: 'Uczestnik' });
    }
  }

  closeDeleteUserModal() {
    this.userToDelete.set(null);
  }

  confirmRemoveParticipant() {
    const user = this.userToDelete();
    if (!user || !this.event()) return;

    const eventId = this.event()!._id;

    this.eventService.removeParticipant(eventId, user.id).subscribe({
      next: (res) => {
        this.event.update(e => ({
          ...e!,
          participants: res.event.participants
        }));
        this.participants.update(list =>
          list.filter(p => p.id !== user.id && (p as any)._id !== user.id)
        );
        this.closeDeleteUserModal();
      },
      error: err => {
        console.error('Błąd podczas usuwania uczestnika z serwera:', err);
        this.closeDeleteUserModal();
      }
    });
  }
}
