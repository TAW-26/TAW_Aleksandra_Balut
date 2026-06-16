import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 


@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.scss'
})
export class CreateEventComponent implements OnInit {
  fb = inject(FormBuilder);
  eventService = inject(EventService);
  router = inject(Router);
  http = inject(HttpClient); 
  platformId = inject(PLATFORM_ID);
  categories = ['sport', 'gry', 'dzieci', 'spotkania'] as const;

  map: any; 
  marker: any; 
  private L: any; 

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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeaflet();
    }
  }

  async loadLeaflet() {
    
    this.L = await import('leaflet');
    const DefaultIcon = this.L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    this.L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }

  initMap() {
    
    this.map = this.L.map('map-create').setView([50.013, 20.995], 14);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.updateMarker(e.latlng.lat, e.latlng.lng);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
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
      locationName: this.form.value.locationName ?? '',
      location: {
        type: 'Point' as const,
        coordinates: (this.form.value.location?.coordinates ?? [0, 0]) as [number, number]
      },
      maxParticipants: this.form.value.maxParticipants ?? 0,
      category: this.form.value.category as (typeof this.categories)[number]
    };

    this.eventService.createEvent(payload).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error(err)
    });
  }
}
