import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { merge } from 'rxjs';
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(3)]), // نام کاربری الزامی است
    password: new FormControl('', [Validators.required, Validators.minLength(6)]) // رمز عبور الزامی است
  });

  private loginApiUrl = 'https://api.becheen.ir:7001/api/User/Login'; // Replace with your login API URL

  constructor(private router: Router, private http: HttpClient) { }


  onSubmit() {
    if (this.signUpForm.valid) {
      // Prepare the payload
      const payload = {
        email: this.signUpForm.get('email')?.value,
        password: this.signUpForm.get('password')?.value
      };

      this.http.post(this.loginApiUrl, payload).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          // this.router.navigate(['/home']); // Replace `/home` with your target route
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
}
