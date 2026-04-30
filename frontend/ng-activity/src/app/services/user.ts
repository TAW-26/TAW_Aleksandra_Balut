import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3100/api/users';
  getUser(id: string) {
    return this.http.get<{ id: string; email: string; username: string }>(
      `${this.baseUrl}/${id}`
    );
  }

}
