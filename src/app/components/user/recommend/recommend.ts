import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MovieCard } from '../../movie-card/movie-card';
import { Spinner } from '../../spinner/spinner'

@Component({
  standalone: true,
  selector: 'app-recommendations',
  imports: [CommonModule, MovieCard, Spinner],
  templateUrl: 'recommend.html'
})
export class Recommendations {
  private apiUrl = 'http://localhost:8080';
  private http = inject(HttpClient);
  recommendations = signal<any[]>([]);

  isLoading = signal<boolean>(true);

  constructor() {
    this.http.get<any[]>(`${this.apiUrl}/user/recommendations`)
      .subscribe({
        next: (data => {
          this.recommendations.set(data);
          this.isLoading.set(false);
          console.log('Profile and preferences loaded', this.recommendations())
        }),
        error: (err) => {
          console.error('Failed to load data', err)
          this.isLoading.set(false);
        }
      });
  }
}

