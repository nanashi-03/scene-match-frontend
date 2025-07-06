import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Spinner } from '../spinner/spinner';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Spinner],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
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
    console.log(this.form.value)
    this.isLoading.set(true);

    this.auth.login(this.form.value as { username: string; password: string }).subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: () => {
        this.error.set('Invalid credentials')
        this.isLoading.set(false);
      }
    });
  }

  navigate(path: string, message: string) {
    this.snack.open(message, 'Close', { duration: 3000 });
    this.router.navigate([path]);
  }
}
