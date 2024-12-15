import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

interface VerificationResponse {
  verificationCodeId: string;
  success: boolean;
  message: string | undefined;
  errorCode: number;
}

@Component({
  selector: 'app-recovery-pass-email',
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
  templateUrl: './recovery-pass-email.component.html',
  styleUrl: './recovery-pass-email.component.scss'
})
export class RecoveryPassEmailComponent {
  private apiUrl = environment.apiBaseUrl + '/User/SendVerificationCode';

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  ngOnInit(): void {
    this.navVisibilityService.hide()
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private navVisibilityService: NavigationVisibilityService,
    private toastr: ToastrService,
  ) { }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.value.email;

      this.http.post<VerificationResponse>(this.apiUrl, { email : email, isForPasswordRecovery : true }).subscribe({
        next: (response) => {
          var verificationCodeId = '';
          if (response.success) {
            verificationCodeId = response['verificationCodeId'];
            this.toastr.success('کد تایید ارسال شد!');

            if (!this.signUpForm.controls.email?.hasError('email') && !this.signUpForm.get('email')?.hasError('required'))
              this.router.navigate(['/recovery-pass-code'], { queryParams: { email, verificationCodeId } });
          }
          else {
            this.toastr.error(response.message);
          }
        },
        error: (error) => {
        }
      })
    } else {
    }
  }


  // onSubmit() {
  //   this.router.navigate(['/recovery-pass-code'], { queryParams: { email: 'dafdkj@gm.com', verificationCodeId: 12345 } });
  // }
}
