import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
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

    // this.callApi();
  }

  callApi() {
    const apiUrl = 'https://api.becheen.ir:7001/api/Group/Create';

    const payload = {
      name: 'Test Group',
      description: 'This is a test group',
      imageId: 'test-image-id',
      membersToAdd: ['member1', 'member2'],
    };

    this.http.post(apiUrl, payload).subscribe(
      (response) => {
        console.log('API Response:', response);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  sendAuthorizationCode(authCode: String) {
    const authorizationCode = authCode;
    const apiUrl = 'https://api.becheen.ir:7001/api/User/GoogleLogin';

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
