import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  submit() {
    if (this.form.invalid) return;
    const payload = {
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? ''
    };
    this.auth.login(payload).subscribe({
      next: (res) => {
        this.auth.setSession(res.token, res.user);
        this.router.navigate(['/']);
      },
      error: err => console.error('Login error: ', err)
    });
  }
}
