import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpAuthComponent } from './sign-up-auth/sign-up-auth.component';
import { SignUpEndComponent } from './sign-up-end/sign-up-end.component';

export const routes: Routes = [
    { path: '', redirectTo: 'sign-up', pathMatch: 'full' }, // Redirect to 'sign-up' on load
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'sign-up-auth', component: SignUpAuthComponent },
    // Other routes can go here
];