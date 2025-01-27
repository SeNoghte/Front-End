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
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

interface SignUp {
  success: boolean;
  message: string | undefined;
  errorCode: number;
}

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
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_-]+$/)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]
    )
  });

  email: string | null = null;
  verificationCodeId: string | null = null;
  private signUpApiUrl = environment.apiUrl +'/User/SignUp';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.verificationCodeId = params['verificationCodeId'];
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

      this.http.post<SignUp>(this.signUpApiUrl, payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/login']); // Replace `/welcome` with your target route
            this.toastr.success('ثبت نام با موفقیت انجام شد');
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
      // this.toastr.error('Form is not valid');
    }
  }
}
