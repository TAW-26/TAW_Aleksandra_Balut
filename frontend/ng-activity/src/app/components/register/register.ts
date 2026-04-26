import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  submit() {
    if (this.form.invalid) return;
    const payload = {
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? ''
    };
    this.auth.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: err => console.error('Register error: ', err)
    });
  }
}
