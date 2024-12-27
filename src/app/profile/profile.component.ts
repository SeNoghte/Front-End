import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment-jalaali';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule],
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

  teams: { name: string; icon: string | null; avatarLetter: string; avatarColor: string }[] = [];



  programsMessage = {
    owner: 'برنامه‌ای در حال حاضر موجود نیست.',
    others: 'برنامه‌های مشترک وجود ندارد.',
  };

  activeTab: string = 'teams';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });
    this.fetchUserProfile();
    this.fetchUserTeams();

  }

  fetchUserProfile(): void {
    const apiUrl = environment.apiUrl + '/User/Profile';
    this.http.post<any>(apiUrl, {}).subscribe(
      (response) => {
        if (response.success) {
          const jalaliDate = moment(response.user.joinedDate, 'YYYY-MM-DD')
            .locale('fa')
            .format('jD jMMMM jYYYY');

          this.userProfile = {
            name: response.user.name,
            username: response.user.username,
            email: response.user.email,
            status: response.user.aboutMe,
            lastUpdated: jalaliDate,
            imageUrl: response.user.image || 'assets/icons/default-profile-image.svg',
          };
        } else {
          this.toastr.error('پروفایل بارگذاری نشد', 'خطا در دریافت اطلاعات کاربر');
          console.error('Error fetching profile:', response.message);
        }
      },
      (error) => {
        this.toastr.error('ارتباط با سرور برقرار نشد', 'خطا در ارتباط');
        console.error('API request failed:', error);
      }
    );
  }

  fetchUserTeams(): void {
    const apiUrl = environment.apiUrl + '/User/Profile';
    this.http.post<any>(apiUrl, {}).subscribe(
      (response) => {
        if (response.success && response.myGroups) {
          this.teams = response.myGroups.map((group: any) => {
            const { letter, color } = this.generateAvatar(group.name);
            return {
              name: group.name,
              icon: group.image || null,
              avatarLetter: letter,
              avatarColor: color,
            };
          });
        } else {
          this.toastr.warning('هیچ گروهی برای نمایش وجود ندارد', 'هشدار');
          console.error('No groups found or error in API response');
        }
      },
      (error) => {
        this.toastr.error('ارتباط با سرور برقرار نشد', 'خطا در دریافت لیست گروه‌ها');
        console.error('API request failed:', error);
      }
    );
  }



  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  editProfile(): void {
    console.log('Edit button clicked');
  }

  generateAvatar(name: string | null): { letter: string; color: string } {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7',
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    ];

    const validName = name && name.trim().length > 0 ? name : 'ناشناس';
    const letter = validName.charAt(0).toUpperCase();
    const color = colors[validName.charCodeAt(0) % colors.length];
    return { letter, color };
  }
}
