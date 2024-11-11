import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {merge} from 'rxjs';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

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
    MatButtonModule
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

  constructor(private route: ActivatedRoute , private router : Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['em'];
      // if (this.email) {
      //   this.signUpForm.get('em')?.setValue(this.email); // مقداردهی فیلد ایمیل
      // }
      console.log('raeis al sadat : ',this.email)
    });
  }
  
  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form Data:', this.signUpForm.value);
    } else {
      console.log('Form is not valid');
    }
  }
}
