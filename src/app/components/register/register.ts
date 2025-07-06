import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Spinner } from '../spinner/spinner';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Spinner],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  error = signal('');

  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  isLoading = signal<boolean>(false);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  submit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);

    this.auth.register(this.form.value as { username: string; password: string }).subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: () => {
        this.error.set('Registration failed')
        this.isLoading.set(false);
      }
    });
  }

  navigate(path: string, message: string) {
    this.snack.open(message, 'Close', { duration: 3000 });
    this.router.navigate([path]);
  }
}
