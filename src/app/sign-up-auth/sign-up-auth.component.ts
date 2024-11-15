import { CommonModule } from '@angular/common';
import {  Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Route } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';

@Component({
  selector: 'app-sign-up-auth',
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
    HttpClientModule
  ],
  templateUrl: './sign-up-auth.component.html',
  styleUrl: './sign-up-auth.component.scss'
})

export class SignUpAuthComponent {
  private verifyApiUrl = 'https://api.becheen.ir:7001/api/User/VerifyVerificationCode'; // The API endpoint for verification
  verificationCodeId: string | null = null;
  email: string | null = null;

  signUpForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }),
    confirmationCode: new FormControl('', [Validators.required]),
  });


  constructor(private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private navVisibilityService: NavigationVisibilityService,
  ) { }

  ngOnInit(): void {
    this.navVisibilityService.hide()

    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.verificationCodeId = params['verificationCodeId'];

      if (this.email) {
        this.signUpForm.get('email')?.setValue(this.email); 
      }
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const code = this.signUpForm.get('confirmationCode')?.value;

      const payload = {
        code : code,
        verificationCodeId: this.verificationCodeId
      }

      this.http.post(this.verifyApiUrl, payload).subscribe({
        next  : (response) => {
          this.router.navigate(['/sign-up-end'], { queryParams: { email : this.email, verificationCodeId : this.verificationCodeId } });
        },
        error : (error) => {
        }
      })
    } else {
    }
  }
}
