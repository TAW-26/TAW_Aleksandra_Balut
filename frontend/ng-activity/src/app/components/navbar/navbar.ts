import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  menuOpen = signal(false);
  auth = inject(AuthService);
  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }
  logout() {
    this.auth.logout();
  }
}
