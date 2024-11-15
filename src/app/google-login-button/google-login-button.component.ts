import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
declare var google: any;
// declare var gapi: any;

@Component({
  selector: 'app-google-login-button',
  standalone: true,
  imports: [
    MatRippleModule,
  ],
  templateUrl: './google-login-button.component.html',
  styleUrl: './google-login-button.component.scss'
})
  export class GoogleLoginButtonComponent {
  @Output() loginSuccess = new EventEmitter<any>();
  @Output() loginFailure = new EventEmitter<any>();
  @ViewChild('googleButtonContainer', { static: true }) googleButtonContainer!: ElementRef;


  ngAfterViewInit(): void {
    // Initialize Google Identity Services
    google.accounts.id.initialize({
      client_id: '178853996623-7d8dh0tal921q54iju05fhqhqdm03gen.apps.googleusercontent.com', // Replace with your actual Google Client ID
      callback: this.handleCredentialResponse.bind(this),
      ux_mode: 'redirect',  // Use redirect mode instead of popup
      login_uri: 'http://localhost:4200/landing'  // Specify where users are redirected after login
    });

    // Render the Google Sign-In button
    google.accounts.id.renderButton(
      this.googleButtonContainer.nativeElement,
      { theme: 'outline', size: 'large' } // Customize the button appearance here
    );
  }

  handleCredentialResponse(response: any): void {
    console.log('Google response object:', response);  // Log the full response
    const jwtToken = response.credential;
    if (jwtToken) {
      console.log('JWT Token received:', jwtToken);
      // Handle the token, e.g., store it or send it to your backend
    } else {
      console.error('JWT Token not received');
    }
  }
}
