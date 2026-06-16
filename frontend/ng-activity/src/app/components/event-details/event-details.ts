import { Component, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  router = inject(Router);
  eventService = inject(EventService);
  auth = inject(AuthService);
  userService = inject(UserService);
  platformId = inject(PLATFORM_ID); 

  event = signal<EventModel | null>(null);
  organizer = signal<{ id: string; username: string; email: string } | null>(null);

  isDeleteModalOpen = signal<boolean>(false);

  currentUserId = computed(() => this.auth.user()?.id);
  isLoggedIn = computed(() => this.auth.isLoggedIn());
  isOwner = computed(() => this.event()?.creatorId === this.currentUserId());
  isJoined = computed(() => this.event()?.participants?.includes(this.currentUserId() || '') ?? false);
  isLiked = computed(() => this.event()?.likes?.includes(this.currentUserId() || '') ?? false);

  daysLeft = computed(() => {
    const dateStr = this.event()?.date;
    if (!dateStr) return 0;
    const eventDate = new Date(dateStr);
    const today = new Date();
    return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  });

  mapDetails: any; 
  private L: any;   

  async initDetailsMap(lng: number, lat: number) {
    if (!this.L) {
      this.L = await import('leaflet');
    }

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

    const isMobile = this.L.Browser ? this.L.Browser.mobile : false;

    this.mapDetails = this.L.map('map-details', {
      dragging: !isMobile,
      scrollWheelZoom: false
    }).setView([lat, lng], 15);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.mapDetails);

    this.L.marker([lat, lng]).addTo(this.mapDetails)
      .bindPopup(`<b>${this.event()?.title}</b><br>${this.event()?.locationName}`)
      .openPopup();
  }

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadEvent(id);
  }

  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event.set(data);

        if (isPlatformBrowser(this.platformId)) {
          const [lng, lat] = data.location?.coordinates ?? [21.017, 52.237];
          setTimeout(() => this.initDetailsMap(lng, lat), 50);
        }

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
        this.event.update(e => ({ ...e!, participants: res.event.participants }));
      }
    });
  }

  leave() {
    if (!this.event()) return;
    this.eventService.leaveEvent(this.event()!._id).subscribe({
      next: (res: any) => {
        this.event.update(e => ({ ...e!, participants: res.event.participants }));
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
        this.event.update(e => ({ ...e!, likes: updatedLikes }));
      }
    });
  }

  openDeleteModal() {
    console.log('Przycisk kliknięty, zmieniam stan sygnału!');
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
  }

  confirmDelete() {
    if (!this.event()) return;
    const id = this.event()!._id;
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.closeDeleteModal();
        console.error(err);
      }
    });
  }
}
