import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: 'home.html',
  styleUrl: 'home.scss'
})
export class Home {
  private router = inject(Router)

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
