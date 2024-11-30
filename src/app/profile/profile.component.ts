import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isOwner: boolean = true;
  userProfile = {
    name: '',
    username: '',
    email: '',
    status: '',
    lastUpdated: '',
    imageUrl: ''
  };

  teams = [
    { name: 'صخره نوردی ستاک', icon: 'assets/icons/member1.svg' },
    { name: 'کافه بازی ونک', icon: 'assets/icons/member2.svg' },
    { name: 'فوتبال دانشکده کامپیوتر', icon: 'assets/icons/member3.svg' },
  ];

  programsMessage = {
    owner: 'برنامه‌ای در حال حاضر موجود نیست.',
    others: 'برنامه‌های مشترک وجود ندارد.',
  };

  activeTab: string = 'teams';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      this.fetchUserProfile();


  }

  fetchUserProfile(): void {
    const apiUrl = 'https://api.becheen.ir:6001/api/User/Profile';
    this.http.post<any>(apiUrl, {}).subscribe(
      (response) => {
        if (response.success) {
          this.userProfile = {
            name: response.user.name,
            username: response.user.username,
            email: response.user.email,
            status: 'درباره من',
            lastUpdated: new Date(response.user.joinedDate).toLocaleDateString(),
            imageUrl: response.user.image || 'assets/icons/default-profile-image.svg'
          };
        } else {
          console.error('Error fetching profile:', response.message);
        }
      },
      (error) => {
        console.error('API request failed:', error);
      }
    );
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  editProfile(): void {
    console.log('Edit button clicked');
    // this.router.navigate(['/profile-edit']);
  }
}
