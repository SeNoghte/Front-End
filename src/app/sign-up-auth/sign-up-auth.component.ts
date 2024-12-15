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
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environment';

interface VerificationCode {
  success: boolean;
  message: string | undefined;
  errorCode: number;
  verificationCodeId: string;
}

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
  private verifyApiUrl = environment.apiBaseUrl + '/VerifyVerificationCode'; 
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
    private toastr: ToastrService,
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

      this.http.post<VerificationCode>(this.verifyApiUrl, payload).subscribe({
        next  : (response) => {
          if(response.success){
            this.toastr.success('کد تایید شد!');
            this.router.navigate(['/sign-up-end'], { queryParams: { email : this.email, verificationCodeId : this.verificationCodeId } });
          }
          else{
            this.toastr.error(response.message);
          }
        },
        error : (error) => {
          this.toastr.error(error);
        }
      })
    } 
    else {
    }
  }
}
