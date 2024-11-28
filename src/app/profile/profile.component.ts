import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  // متغیر برای تعیین حالت صاحب پروفایل یا مشاهده پروفایل دیگران
  isOwner: boolean = true;

  // داده‌های پروفایل (شبیه‌سازی شده)
  userProfile = {
    name: 'سیاوش قمیشی',
    username: 'siavash_joon',
    status: 'من به بن بست نرسیدم، راهمو سد کردن. با تو مشکلی ندارم با خودم لج کردم',
    lastUpdated: '11 شهریور 1402',
  };

  // لیست اکیپ‌ها یا اکیپ‌های مشترک
  teams = [
    { name: 'صخره نوردی ستاک', icon: 'https://via.placeholder.com/40' },
    { name: 'کافه بازی ونک', icon: 'https://via.placeholder.com/40' },
    { name: 'فوتبال دانشکده کامپیوتر', icon: 'https://via.placeholder.com/40' },
  ];

  // متن پیش‌فرض برای برنامه‌ها
  programsMessage = {
    owner: 'برنامه‌ای در حال حاضر موجود نیست.',
    others: 'برنامه‌های مشترک وجود ندارد.',
  };

  // تب فعال
  activeTab: string = 'teams';

  // تغییر تب
  switchTab(tab: string) {
    this.activeTab = tab;
  }

  // عملکرد ویرایش (برای آینده)
  editProfile() {
    console.log('Edit button clicked');
    // می‌توانید اینجا کد مربوط به ویرایش را اضافه کنید
  }
}
