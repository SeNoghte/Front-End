import { Component, EventEmitter, Output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
declare var google: any;
declare var gapi: any;

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
  centered = false;
  disabled = false;
  unbounded = false;

  ngAfterViewInit(): void {
    this.initializeGoogleSignIn();
    this.loadGoogleAuth();
  }

  loadGoogleAuth(): void {
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id: '178853996623-7d8dh0tal921q54iju05fhqhqdm03gen.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      this.attachSignin(document.getElementById('customBtn')!); // از عملگر non-null assertion استفاده کنید
    });
  }


  attachSignin(element: HTMLElement): void {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.attachClickHandler(element!, {}, // از عملگر non-null assertion استفاده می‌کنیم
      (googleUser: any) => {
        const profile = googleUser.getBasicProfile();
        console.log('Name: ' + profile.getName());
        console.log('Email: ' + profile.getEmail());
        // ارسال اطلاعات به سرور یا انجام سایر کارها
      }, (error: any) => {
        console.error(JSON.stringify(error, undefined, 2));
      });
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
