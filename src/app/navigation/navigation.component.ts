import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  activeTab = 'home';

  setActive(tab: string) {
    this.activeTab = tab;
    // Handle navigation logic here, e.g., navigate to different pages
  }
}
