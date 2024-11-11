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
import { ActivatedRoute } from '@angular/router';

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
    MatButtonModule
  ],
  templateUrl: './sign-up-auth.component.html',
  styleUrl: './sign-up-auth.component.scss'
})
export class SignUpAuthComponent {
  signUpForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }),
    confirmationCode: new FormControl('', [Validators.required]),
  });

  email: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // دریافت پارامتر `email` از queryParams
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.signUpForm.get('email')?.setValue(email); // مقداردهی فیلد ایمیل
      }
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      // منطق ارسال فرم یا تایید کد
      console.log('Form Data:', this.signUpForm.value);
    } else {
      console.log('Form is not valid');
    }
  }
}
