import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignUpAuthComponent } from './sign-up-auth/sign-up-auth.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignUpComponent,SignUpAuthComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Front-End';
}
