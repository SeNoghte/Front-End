import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ExploreGroupsApiResponse, Group } from '../shared/models/group-model-type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-explore-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: './explore-search.component.html',
  styleUrl: './explore-search.component.scss'
})
export class ExploreSearchComponent {
  searchTerm: string = '';
  private searchSubject: Subject<string> = new Subject<string>();
  usersList: any[] = [];
  publicGroups! : Group[] ; 
  groups = [
    { name: 'صخره نوردی ستاک' },
    { name: 'کافه بازی ونک' },
    { name: 'فوتبال دانشکده کامپیوتر' },
    { name: 'یوهو' },
    { name: 'املت' },
    { name: 'کوهنوردی' },
  ]

  events = [
    {
      image: 'https://via.placeholder.com/100',
      profileImage: 'https://via.placeholder.com/40',
      name: 'محمد حسین',
      title: 'فتح قله دماوند',
      description:
        'برنامه صعود به دماوند یکی از بلندترین قله‌های ایران. سه روز هیجان و تجربه بی‌نظیر!',
      date: 'یکشنبه ۱۴۰۲/۰۹/۱۲ ساعت ۱۲:۳۰'
    },
    {
      image: 'https://via.placeholder.com/100',
      profileImage: 'https://via.placeholder.com/40',
      name: 'محمد حسین',
      title: 'کوهنوردی در البرز',
      description:
        'برنامه کوهنوردی یک‌روزه در طبیعت زیبای البرز. به همراه تیم حرفه‌ای.برنامه کوهنوردی یک‌روزه در طبیعت زیبای البرز. به همراه تیم حرفه‌ای.برنامه کوهنوردی یک‌روزه در طبیعت زیبای البرز. به همراه تیم حرفه‌ای.برنامه کوهنوردی یک‌روزه در طبیعت زیبای البرز. به همراه تیم حرفه‌ای.',
      date: 'پنجشنبه ۱۴۰۲/۰۹/۱۰ ساعت ۰۸:۰۰'
    }
  ];

  ngOnInit() {
    const GetGroupsAPI = environment.apiUrl + '/Group/GetGroups';

    const requestBody = {
      filter: "",
      isPrivate: false,
      pageIndex: 1,
      pageSize: 1000,
    };

    this.http.post<ExploreGroupsApiResponse>(GetGroupsAPI, requestBody).subscribe(
      (res) => {
        console.log(res);
        this.publicGroups = res.filteredGroups
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );
  }

  constructor(
    private Router: Router,
    private http: HttpClient,
    private toastr: ToastrService,

  ) { }

  backToExplore() {
    this.Router.navigate(['explore'])
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
    const getUsersApiUrl = environment.apiUrl + '/User/GetUsers';
    const payload = {
      filter: this.searchTerm,
      pageIndex: 10,
      pageSize: 10000,
    };
    this.http.post(getUsersApiUrl, payload).subscribe(
      (res: any) => {
        this.usersList = res.filteredUsers;
      },
    );
  }

  onTabChange(event: any): void {
    // `event.index` gives the index of the selected tab
    if (event.index === 0) {
      // Show the navigation bar for Option 1
    } else if (event.index === 1) {
      // Hide the navigation bar for Option 2
    }
  }
}
