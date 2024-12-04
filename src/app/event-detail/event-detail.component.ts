import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    HttpClientModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent {

  event = {
    image: 'https://via.placeholder.com/100',
    profileImage: 'https://via.placeholder.com/40',
    name: 'محمد حسین',
    title: 'کوهنوردی در البرز',
    description:
    'برنامه مهیج و جذاب فتح بلند ترین قله ایران سه روزه حرکت از تهران |‌ ناهار با تور برای شرکت در این برنامه حتما باید قبلا سابقه صعود به قله ادامه توضیحات توضیحات بیشتر',
    date: 'پنجشنبه ۱۴۰۲/۰۹/۱۰ ساعت ۰۸:۰۰',
    members : [
      'امیرحسین',
      'رضا سادیسمی',
      'محمدرضا',
      'عرفان میرزایی',
      '56 نفر دیگه'
    ]
  }

  ngOnInit(): void {
    this.navVisibilityService.hide()
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private navVisibilityService: NavigationVisibilityService,
    private toastr: ToastrService,
  ) { }
}
