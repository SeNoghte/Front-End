import { Component } from '@angular/core';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})

export class NavigationComponent {
  activeTab = 'home'
  isVisible = true;

  constructor(private navVisibilityService: NavigationVisibilityService) {}

  ngOnInit(): void {
    // Subscribe to visibility observable
    this.navVisibilityService.visibility$.subscribe(visible => {
      this.isVisible = visible;
    });
  }

  setActive(tab: string) {
    this.activeTab = tab;
    // Handle navigation logic here, e.g., navigate to different pages
  }
}
