import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Spinner } from '../../spinner/spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Spinner],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private apiUrl = 'http://localhost:8080';
  private http = inject(HttpClient);
  profile = signal<any>(null);
  prefs = signal<any>(null);

  isLoading = signal<boolean>(true);

  constructor() {
    const profile$ = this.http.get<any>(`${this.apiUrl}/user/profile`);
    const prefs$ = this.http.get<any>(`${this.apiUrl}/user/preferences`);

    forkJoin([profile$, prefs$]).subscribe({
      next: ([profileData, prefsData]) => {
        this.profile.set(profileData);
        this.prefs.set(prefsData);
        console.log('Profile and preferences loaded', this.prefs());
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load data', err);
        this.isLoading.set(false);
      }
    });
  }

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

  removeLikedGenre(genre: string) {
    this.http.delete(`${this.apiUrl}/user/preferences`, {
      body: { likedGenre: genre }
    }).subscribe(() => {
      this.prefs.update((p: any) => ({
        ...p,
        likedGenres: (p.likedGenres ?? []).filter((g: string) => g !== genre)
      }));
    });
  }

  removeDislikedGenre(genre: string) {
    this.http.delete(`${this.apiUrl}/user/preferences`, {
      body: { dislikedGenre: genre }
    }).subscribe(() => {
      this.prefs.update((p: any) => ({
        ...p,
        dislikedGenres: (p.dislikedGenres ?? []).filter((g: string) => g !== genre)
      }));
    });
  }

  removeLikedKeyword(keyword: string) {
    this.http.delete(`${this.apiUrl}/user/preferences`, {
      body: { likedKeyword: keyword }
    }).subscribe(() => {
      this.prefs.update((p: any) => ({
        ...p,
        likedKeywords: (p.likedKeywords ?? []).filter((k: string) => k !== keyword)
      }));
    });
  }

  removeDislikedKeyword(keyword: string) {
    this.http.delete(`${this.apiUrl}/user/preferences`, {
      body: { dislikedKeyword: keyword }
    }).subscribe(() => {
      this.prefs.update((p: any) => ({
        ...p,
        dislikedKeywords: (p.dislikedKeywords ?? []).filter((k: string) => k !== keyword)
      }));
    });
  }
}