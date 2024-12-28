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

  constructor(private navVisibilityService: NavigationVisibilityService,private Router: Router,) {}

  ngOnInit(): void {
    this.navVisibilityService.visibility$.subscribe(visible => {
      this.isVisible = visible;
    });
  }

  setActive(tab: string) {
    if(tab=='groups'){
      this.Router.navigate(['group-page']);
    }
    if(tab=='profile'){
      this.Router.navigate(['profile']);
    }
    if(tab=='home'){
      this.Router.navigate(['landing']);
    }
    this.activeTab = tab;
  }

  // redirectGroupList(){
    
  // }
}
