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
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-up-end',
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
  templateUrl: './sign-up-end.component.html',
  styleUrl: './sign-up-end.component.scss'
})
export class SignUpEndComponent {
  signUpForm = new FormGroup({
    name: new FormControl(''),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]), // نام کاربری الزامی است
    password: new FormControl('', [Validators.required, Validators.minLength(6)]) // رمز عبور الزامی است
  });

  email: string | null = null;
  verificationCodeId: string | null = null;
  private signUpApiUrl = 'https://api.becheen.ir:7001/api/User/SignUp';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.verificationCodeId = params['verificationCodeId'];
      console.log('email : ', this.email, 'verfi id : ', this.verificationCodeId)
    });
  }

  onSubmit() {
    if (this.signUpForm.valid && this.email && this.verificationCodeId) {

      const payload = {
        name: this.signUpForm.get('name')?.value,
        username: this.signUpForm.get('username')?.value,
        password: this.signUpForm.get('password')?.value,
        email: this.email,
        verificationCodeId: this.verificationCodeId
      };

      this.http.post(this.signUpApiUrl, payload).subscribe({
        next: (response) => {
          console.log('Sign-up successful:', response);
          // Navigate to a success page or home page after successful sign-up
          this.router.navigate(['/login']); // Replace `/welcome` with your target route
        },
        error: (error) => {
          console.error('Sign-up failed:', error);
          // Handle error (e.g., show an error message)
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
