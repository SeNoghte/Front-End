import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Extract token from URL or process the response if needed
    const token = this.getJwtTokenFromUrl();
    console.log('Received JWT Token:', token);

    // Do something with the token, such as verifying it with a backend
    // Then, redirect the user to the desired page
    // this.router.navigate(['/home']);  // Redirect after processing
  }

  getJwtTokenFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('credential');  // 'credential' holds the JWT token
  }
}
