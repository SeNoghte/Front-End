import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HttpClientModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const token = this.getCodeFromUrl();
    console.log('Received code Token from google :', token);
    if (token){
      this.sendAuthorizationCode(token)
    }
  }

  sendAuthorizationCode(authCode: String) {
    const authorizationCode = authCode;
    const apiUrl = environment.apiUrl +'/User/GoogleLogin';
    const requestBody = { authorizationCode };

    this.http.post(apiUrl, requestBody).subscribe(
      (response: any) => {
        if (response.success && response.token) {
          console.log('JWT Token:', response.token);
          localStorage.setItem('jwtToken', response.token);
        } else {
          console.error('Failed to retrieve JWT token:', response.message);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  getCodeFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('code');

    return token;
  }
}
