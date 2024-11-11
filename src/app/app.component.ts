import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignUpAuthComponent } from './sign-up-auth/sign-up-auth.component';
import { SignUpEndComponent } from './sign-up-end/sign-up-end.component';
import { LoginComponent } from "./login/login.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { NavigationVisibilityService } from './services/navigation-visibility.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    SignUpComponent,
    SignUpAuthComponent,
    SignUpEndComponent,
    LoginComponent,
    NavigationComponent,
    CommonModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router, private navVisibilityService: NavigationVisibilityService) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide navigation for specific routes
        if (['/sign-up', '/sign-up-auth'].includes(event.url)) {
          this.navVisibilityService.hide();
        } else {
          this.navVisibilityService.show();
        }
      }
    });
  }
}
