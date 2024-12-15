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
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environment';


interface VerificationResponse {
  verificationCodeId: string;
  success: boolean;
  message: string | undefined;
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
    MatButtonModule
],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SignUpComponent {
  private apiUrl = environment.apiBaseUrl + '/SendVerificationCode';

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private navVisibilityService: NavigationVisibilityService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() : void { 
    this.navVisibilityService.hide()
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.value.email;

      this.http.post<VerificationResponse>(this.apiUrl, { email }).subscribe({
        next: (response) => { 
          var verificationCodeId = '';  
          if(response.success){
            verificationCodeId = response['verificationCodeId'];
            this.toastr.success('کد تایید ارسال شد!');
            
            if (!this.signUpForm.controls.email?.hasError('email') && !this.signUpForm.get('email')?.hasError('required'))
              this.router.navigate(['/sign-up-auth'], { queryParams: { email,verificationCodeId  } });
          }       
          else{
            this.toastr.error(response.message);
          }
        },
        error: (error) => {
        }
      })
    } else {
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  googleLogin() {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=178853996623-7d8dh0tal921q54iju05fhqhqdm03gen.apps.googleusercontent.com&redirect_uri=http://localhost:4200/landing&response_type=code&scope=openid%20email%20profile`;
  }
}
