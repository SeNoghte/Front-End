import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

interface Login {
  success: boolean;
  message: string | undefined;
  errorCode: number;
  token: string;
}

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
  styleUrl: './login.component.scss',
})

export class LoginComponent {
  signUpForm = new FormGroup({
    emailOrUsername: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  private loginApiUrl = environment.apiBaseUrl + '/User/Login';

  ngOnInit(): void {
    this.navVisibilityService.hide()
  }

  constructor(private router: Router,
    private http: HttpClient,
    private navVisibilityService: NavigationVisibilityService,
    private toastr: ToastrService,

  ) { }

  onSubmit() {
    if (this.signUpForm.valid) {
      const payload = {
        emailOrUsername: this.signUpForm.get('emailOrUsername')?.value,
        password: this.signUpForm.get('password')?.value
      };

      this.http.post<Login>(this.loginApiUrl, payload).subscribe({
        next: (response) => {
          if (response.success) {
            localStorage.setItem('JWTtoken', response.token);
            console.log('Saved JWT Token:', localStorage.getItem('JWTtoken'));
            this.toastr.success('Login successful!');
            this.router.navigate(['/landing']);
          }
          else {
            this.toastr.error(response.message);
          }
        },
        error: (error) => {
          this.toastr.error(error);
        }
      });
    } else {
    }
  }

  navigateToLogin() {
    this.router.navigate(['/sign-up']);
  }

  navToRecovery(){
    this.router.navigate(['/recovery-pass-email']);
  }

  googleLogin() {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=178853996623-7d8dh0tal921q54iju05fhqhqdm03gen.apps.googleusercontent.com&redirect_uri=http://localhost:4200/landing&response_type=code&scope=openid%20email%20profile`;
  }
}
