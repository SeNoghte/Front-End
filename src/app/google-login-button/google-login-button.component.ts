import { Component, EventEmitter, Output } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-google-login-button',
  standalone: true,
  imports: [],
  templateUrl: './google-login-button.component.html',
  styleUrl: './google-login-button.component.scss'
})
export class GoogleLoginButtonComponent {
  @Output() loginSuccess = new EventEmitter<any>();
  @Output() loginFailure = new EventEmitter<any>();

  ngAfterViewInit(): void {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn(): void {
    if (google && google.accounts) {
      google.accounts.id.initialize({
        client_id: '178853996623-7d8dh0tal921q54iju05fhqhqdm03gen.apps.googleusercontent.com',
        callback: (response: any) => this.handleCredentialResponse(response),
      });
      google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        { theme: 'outline', size: 'large' }
      );
    }
  }

  private handleCredentialResponse(response: any): void {
    if (response.credential) {
      this.loginSuccess.emit(response.credential);
    } else {
      this.loginFailure.emit('Login failed');
    }
  }
}
