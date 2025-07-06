import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth';
import { Spinner } from '../spinner/spinner';

@Component({
  selector: 'app-movie',
  imports: [CommonModule, Spinner],
  templateUrl: './movie.html',
  styleUrl: './movie.scss'
})
export class Movie {
  private apiUrl = 'http://localhost:8080';
  active = inject(ActivatedRoute);
  movieId = signal<string | null>('');
  private http = inject(HttpClient);
  auth = inject(AuthService);
  movie = signal<any>({});
  prefs = signal<any>({ likedGenres: [], dislikedGenres: [], likedKeywords: [], dislikedKeywords: [] });
  isLiked = signal<boolean>(false);
  isWatched = signal<boolean>(false);

  isLoading = signal<boolean>(true);
  isContentLoading = signal<boolean>(false);

  constructor() {
    this.movieId.set(this.active.snapshot.paramMap.get('id'));
    const movie$ = this.http.get<any>(`${this.apiUrl}/movies/` + this.movieId());
    
    if(this.auth.isAuthenticated()) {
      const prefs$ = this.http.get<any>(`${this.apiUrl}/user/preferences`);
      const liked$ = this.http.get<any>(`${this.apiUrl}/user/liked`);
      const watched$ = this.http.get<any>(`${this.apiUrl}/user/watched`);

      forkJoin([movie$, prefs$, liked$, watched$]).subscribe({
        next: ([movieData, prefsData, likedData, watchedData]) => {
          this.movie.set(movieData);
          this.prefs.set(prefsData);
          this.isLiked.set(likedData.includes(movieData.tmdbId));
          this.isWatched.set(watchedData.includes(movieData.tmdbId));
          console.log("Movie Loaded and prefs", this.movie());
          this.isLoading.set(false);
        },
        error: () => {
          console.log("Failed to load movie and prefs");
          this.isLoading.set(false);
        }
      })
    } else {
      movie$.subscribe({
        next: (movieData) => {
          this.movie.set(movieData);
          console.log("Only movie loaded", this.movie())
          this.isLoading.set(false);
        },
        error: () => {
          console.log("Failed to load movie");
          this.isLoading.set(false);
        }
      })
    }
  }

  // --- Genre/Keyword Like/Dislike Logic ---
  isLikedGenre(genre: string) {
    return this.prefs().likedGenres?.includes(genre);
  }
  isDislikedGenre(genre: string) {
    return this.prefs().dislikedGenres?.includes(genre);
  }
  isLikedKeyword(keyword: string) {
    return this.prefs().likedKeywords?.includes(keyword);
  }
  isDislikedKeyword(keyword: string) {
    return this.prefs().dislikedKeywords?.includes(keyword);
  }

  toggleLikeGenre(genre: string) {
    if (this.isLikedGenre(genre)) {
      this.http.delete(`${this.apiUrl}/user/preferences`, { body: { likedGenre: genre } })
        .subscribe(() => {
          this.prefs.update((p: any) => ({
            ...p,
            likedGenres: (p.likedGenres ?? []).filter((g: string) => g !== genre)
          }));
        });
    } else {
      this.http.put(`${this.apiUrl}/user/preferences`, { likedGenre: genre })
        .subscribe(() => {
          this.prefs.update((p: any) => ({
            ...p,
            likedGenres: [...(p.likedGenres ?? []), genre],
            dislikedGenres: (p.dislikedGenres ?? []).filter((g: string) => g !== genre) // Remove from disliked
          }));
        });
    }
  }
  
  toggleDislikeGenre(genre: string) {
    if (this.isDislikedGenre(genre)) {
      this.http.delete(`${this.apiUrl}/user/preferences`, { body: { dislikedGenre: genre } })
        .subscribe(() => {
          this.prefs.update((p: any) => ({
            ...p,
            dislikedGenres: (p.dislikedGenres ?? []).filter((g: string) => g !== genre)
          }));
        });
    } else {
      this.http.put(`${this.apiUrl}/user/preferences`, { dislikedGenre: genre })
        .subscribe(() => {
          this.prefs.update((p: any) => ({
            ...p,
            dislikedGenres: [...(p.dislikedGenres ?? []), genre],
            likedGenres: (p.likedGenres ?? []).filter((g: string) => g !== genre) // Remove from liked
          }));
        });
    }
  }
  
  toggleLikeKeyword(keyword: string) {
    if (this.isLikedKeyword(keyword)) {
      this.http.delete(`${this.apiUrl}/user/preferences`, { body: { likedKeyword: keyword } })
        .subscribe(() => {
          this.prefs.update((p: any) => ({
            ...p,
            likedKeywords: (p.likedKeywords ?? []).filter((k: string) => k !== keyword)
          }));
        });
    } else {
      this.http.put(`${this.apiUrl}/user/preferences`, { likedKeyword: keyword })
        .subscribe(() => {
          this.prefs.update((p: any) => ({
            ...p,
            likedKeywords: [...(p.likedKeywords ?? []), keyword],
            dislikedKeywords: (p.dislikedKeywords ?? []).filter((k: string) => k !== keyword) // Remove from disliked
          }));
        });
    }
  }
  
  toggleDislikeKeyword(keyword: string) {
    if (this.isDislikedKeyword(keyword)) {
      this.http.delete(`${this.apiUrl}/user/preferences`, { body: { dislikedKeyword: keyword } })
        .subscribe(() => {
          this.prefs.update((p: any) => ({
            ...p,
            dislikedKeywords: (p.dislikedKeywords ?? []).filter((k: string) => k !== keyword)
          }));
        });
    } else {
      this.http.put(`${this.apiUrl}/user/preferences`, { dislikedKeyword: keyword })
        .subscribe(() => {
          this.prefs.update((p: any) => ({
            ...p,
            dislikedKeywords: [...(p.dislikedKeywords ?? []), keyword],
            likedKeywords: (p.likedKeywords ?? []).filter((k: string) => k !== keyword) // Remove from liked
          }));
        });
    }
  }

  toggleLike() {
    const tmdbId = this.movie()?.tmdbId;
    if (!tmdbId) {
      console.warn("No TMDB ID available yet.");
      return;
    }

    const endpoint = this.isLiked()
      ? `/user/dislike/${tmdbId}`
      : `/user/like/${tmdbId}`;

    this.http.post(`${this.apiUrl}${endpoint}`, {}).subscribe(() => {
      this.refreshMovie();
    });
  }

  toggleWatch() {
    const tmdbId = this.movie()?.tmdbId;
    if (!tmdbId) {
      console.warn("No TMDB ID available yet.");
      return;
    }

    const endpoint = this.isWatched()
      ? `/user/unwatch/${tmdbId}`
      : `/user/watch/${tmdbId}`;

    this.http.post(`${this.apiUrl}${endpoint}`, {}).subscribe(() => {
      this.refreshMovie();
    });
  }

  refreshMovie() {
    const tmdbId = this.movie()?.tmdbId;
    if (!tmdbId) {
      console.warn("No TMDB ID available yet.");
      return;
    }

    const movie$ = this.http.get<any>(`${this.apiUrl}/movies/${tmdbId}`);
    this.isContentLoading.set(true);

    if (this.auth.isAuthenticated()) {
      const prefs$ = this.http.get<any>(`${this.apiUrl}/user/preferences`);
      const liked$ = this.http.get<any>(`${this.apiUrl}/user/liked`);
      const watched$ = this.http.get<any>(`${this.apiUrl}/user/watched`);

      forkJoin([movie$, prefs$, liked$, watched$]).subscribe({
        next: ([movieData, prefsData, likedData, watchedData]) => {
          this.movie.set(movieData);
          this.prefs.set(prefsData);
          this.isLiked.set(likedData.includes(movieData.tmdbId));
          console.log(this.isLiked())
          this.isWatched.set(watchedData.includes(movieData.tmdbId));
          console.log(this.isWatched())
          this.isContentLoading.set(false);
        },
        error: () => {
          console.log("Failed to load movie and prefs");
          this.isContentLoading.set(false);
        }
      });
    } else {
      movie$.subscribe({
        next: (movieData) => {
          this.movie.set(movieData);
          this.isContentLoading.set(false);
        },
        error: () => {
          console.log("Failed to load movie");
          this.isContentLoading.set(false);
        }
      });
    }
  }
}