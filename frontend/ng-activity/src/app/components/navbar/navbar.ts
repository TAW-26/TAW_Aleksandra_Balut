import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  menuOpen = signal(false);
  auth = inject(AuthService);
  private elementRef = inject(ElementRef);
  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }
  logout() {
    this.auth.logout();
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.menuOpen()) return;

    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.menuOpen.set(false);
    }
  }
}
