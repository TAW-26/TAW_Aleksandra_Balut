import { Component, inject, signal, computed, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-event-map',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './event-map.html',
  styleUrl: './event-map.scss'
})
export class EventMapComponent implements OnInit {
  router = inject(Router);
  eventService = inject(EventService);
  platformId = inject(PLATFORM_ID);

  allEvents = signal<EventModel[]>([]);

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('');
  dateFrom = signal<string>('');
  dateTo = signal<string>('');

  categories = ['sport', 'gry', 'dzieci', 'spotkania'] as const;

  map: any;
  markerLayer: any;
  private L: any;

  filteredEvents = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const fromDate = this.dateFrom();
    const toDate = this.dateTo();

    return this.allEvents().filter(event => {
      const matchesSearch = !query ||
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.locationName && event.locationName.toLowerCase().includes(query));

      const matchesCategory = !cat || event.category === cat;

      const eventDateStr = event.date ? event.date.substring(0, 10) : '';

      const matchesDateFrom = !fromDate || eventDateStr >= fromDate;

      const matchesDateTo = !toDate || eventDateStr <= toDate;

      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeafletAndEvents();
    }
  }

  async loadLeafletAndEvents() {
    this.L = await import('leaflet');

    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.allEvents.set(data);
        this.initMap();
        this.updateMapMarkers();
      },
      error: (err) => console.error('Błąd pobierania wydarzeń:', err)
    });
  }

  initMap() {
    if (!this.L) return;

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

    this.map = this.L.map('all-events-map').setView([52.237, 21.017], 6);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerLayer = this.L.layerGroup().addTo(this.map);

    this.map.on('popupopen', () => {
      const btn = document.querySelector('.popup-go-btn');
      if (btn) {
        btn.addEventListener('click', (e: any) => {
          const id = e.target.getAttribute('data-id');
          if (id) this.router.navigate(['/event', id]);
        });
      }
    });
  }

  onFiltersChange() {
    this.updateMapMarkers();
  }

  updateMapMarkers() {
    if (!this.L || !this.map || !this.markerLayer) return;

    this.markerLayer.clearLayers();
    const markerBounds: any[] = [];

    this.filteredEvents().forEach(event => {
      if (event.location?.coordinates && event.location.coordinates.length === 2) {
        const [lng, lat] = event.location.coordinates;
        if (lat === 0 && lng === 0) return;

        const marker = this.L.marker([lat, lng]);

        const popupContent = `
          <div class="map-popup-card">
            <h4>${event.title}</h4>
            <p><i class="fa fa-map-marker"></i> ${event.locationName || ''}</p>
            <p><i class="fa fa-calendar"></i> ${new Date(event.date).toLocaleString('pl-PL')}</p>
            <button class="popup-go-btn" data-id="${event._id}">Zobacz szczegóły</button>
          </div>
        `;

        marker.bindPopup(popupContent);
        this.markerLayer.addLayer(marker);
        markerBounds.push([lat, lng]);
      }
    });

    if (markerBounds.length > 0) {
      this.map.fitBounds(markerBounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      this.map.setView([52.237, 21.017], 6);
    }
  }
}
