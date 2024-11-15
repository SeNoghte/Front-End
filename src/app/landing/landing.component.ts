import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = this.getCodeFromUrl();
    console.log('Received JWT Token:', token);


  }

  getCodeFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('code');
    
    return token;
  }
}
