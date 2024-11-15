import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]) 
  });

  private loginApiUrl = 'https://api.becheen.ir:7001/api/User/Login';
  ngOnInit(): void {

  }

  constructor(private router: Router, private http: HttpClient) { }

  onSubmit() {
    if (this.signUpForm.valid) {
      const payload = {
        email: this.signUpForm.get('email')?.value,
        password: this.signUpForm.get('password')?.value
      };

      this.http.post(this.loginApiUrl, payload).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/sign-up']);
  }

  googleLogin() {
    // const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'; // your external URL
    // const params = new URLSearchParams({
    //   client_id: '178853996623-7d8dh0tal921q54iju05fhqhqdm03gen.apps.googleusercontent.com',
    //   redirect_uri: encodeURIComponent('http://localhost:4200/landing'),
    //   response_type: 'code',
    //   scope: encodeURIComponent('openid email profile'),
    // }).toString();


    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=178853996623-7d8dh0tal921q54iju05fhqhqdm03gen.apps.googleusercontent.com&redirect_uri=http://localhost:4200/landing&response_type=code&scope=openid%20email%20profile`;
    // console.log(`${baseUrl}?${params}`);
  }
}
