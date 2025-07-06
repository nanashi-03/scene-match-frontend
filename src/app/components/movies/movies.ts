import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MovieCard } from "../movie-card/movie-card";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-movies',
  imports: [InfiniteScrollDirective, MovieCard, CommonModule],
  templateUrl: './movies.html',
  styleUrl: './movies.scss'
})
export class Movies implements OnInit {
  private apiUrl = 'http://localhost:8080';
  private http = inject(HttpClient);
  movies = signal<any[]>([]);
  page = 1;
  size = 20;
  noMoreMovies = signal<boolean>(false);
  userProfile = signal<any>(null);
  // auth = inject(AuthService)
  
  // constructor() {
  //   if(this.auth.isAuthenticated()) {
      
  //   }
  // }

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/user/profile`).subscribe((data) => {
      this.userProfile.set(data);
    });

    this.loadMoreMovies();
  }

  loadMoreMovies() {
    if (this.noMoreMovies()) return;

    this.http
      .get<any>(`${this.apiUrl}/movies?page=${this.page}&size=${this.size}`)
      .subscribe((data) => {
        if (data.length < this.size) {
          this.noMoreMovies.set(true);
        }
        this.movies.set([...this.movies(), ...data]);
        this.page++;
      });
  }

  isLiked(movie: any): boolean {
    return this.userProfile()?.likedMoviesIds?.includes(movie.id) ?? false;
  }

  isWatched(movie: any): boolean {
    return this.userProfile()?.watchedMoviesIds?.includes(movie.id) ?? false;
  }
}
