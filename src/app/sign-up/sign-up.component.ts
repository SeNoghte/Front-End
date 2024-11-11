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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { response } from 'express';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SignUpComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // نام کاربری الزامی است
  });

  private apiUrl = 'https://api.becheen.ir:7001/api/User/SendVerificationCode';

  constructor(private http: HttpClient,
    private router: Router
  ) {

  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form Data:', this.signUpForm.value);

      const email = this.signUpForm.value.email;

      this.http.post(this.apiUrl, { email }).subscribe({
        next: (response) => {
          console.log('verification code sent successfully:', response);
        },
        error: (error) => {
          console.error('Error sending verification code: ', error)
          console.log('inner else');

          if (!this.signUpForm.controls.email?.hasError('email') && !this.signUpForm.get('email')?.hasError('required'))
            this.router.navigate(['/sign-up-auth'], { queryParams: { email } });
        }
      })
    } else {
      console.log('outer else');

      if (!this.signUpForm.controls.email?.hasError('email') && !this.signUpForm.get('email')?.hasError('required'))
        this.router.navigate(['/sign-up-auth']);
    }
  }

  navigateToLogin() {

  }
}
