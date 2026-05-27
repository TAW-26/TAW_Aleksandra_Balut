import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3100/api/auth';
  isLoggedIn = signal(false);
  user = signal<{ id: string; name: string; email: string } | null>(null);
  login(credentials: { email: string; password: string }) {
    return this.http.post<{
      token: string,
      user: { id: string; name: string; email: string }
    }>(`${this.baseUrl}/login`, credentials);
  }
  register(payload: { email: string; password: string; username: string }) {
    return this.http.post<{ message: string; userId: string }>(
      `${this.baseUrl}/register`,
      payload
    );
  }
  setSession(token: string, user: { id: string; name: string; email: string }) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
    this.user.set(user);
  }
  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.user.set(null);
  }
}
