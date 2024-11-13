import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { GoogleLoginButtonComponent } from "../google-login-button/google-login-button.component";


interface VerificationResponse {
  verificationCodeId: string;
  success: boolean;
  message: string | null;
  errorCode: number;
}

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
    GoogleLoginButtonComponent
],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SignUpComponent {
  private apiUrl = 'https://api.becheen.ir:7001/api/User/SendVerificationCode';
  componentId: string;

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // نام کاربری الزامی است
  });

  constructor(private http: HttpClient,
    private router: Router,
    private navVisibilityService: NavigationVisibilityService,
  ) {
    this.componentId = Math.random().toString(36).substring(2, 15);
  }

  ngOnInit() : void { 
    this.navVisibilityService.hide()

    // if (!localStorage.getItem('reloaded')) {
    //   localStorage.setItem('reloaded', 'true');
    //   window.location.reload();
    // } else {
    //   localStorage.removeItem('reloaded');
    // }

    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form Data:', this.signUpForm.value);

      const email = this.signUpForm.value.email;

      this.http.post<VerificationResponse>(this.apiUrl, { email }).subscribe({
        next: (response) => {
          console.log('verification code sent successfully:', response);
          
          const verificationCodeId = response['verificationCodeId'];

          console.log('verification code sent successfully:', verificationCodeId);


          if (!this.signUpForm.controls.email?.hasError('email') && !this.signUpForm.get('email')?.hasError('required'))
            this.router.navigate(['/sign-up-auth'], { queryParams: { email,verificationCodeId  } });
        },
        error: (error) => {
          console.error('Error sending verification code: ', error)
          console.log('inner else');

        }
      })
    } else {
      console.log('outer else');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onGoogleLoginSuccess(credential: any): void {
    console.log('Sign-Up: Google login successful:', credential);
  }

  onGoogleLoginFailure(error: any): void {
    console.error('Sign-Up: Google login failed:', error);
  }
}
