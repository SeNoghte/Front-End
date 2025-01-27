
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
import { ExploreGroupsApiResponse, GetPublicEventListSearchApiResponse, Group, SearchedEvents, TagsApiResponse } from '../shared/models/group-model-type';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment-jalaali';

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
  publicGroups!: Group[];
  searchedEvents!: SearchedEvents[];

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
        console.log(res)
        this.publicGroups = res.filteredGroups
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );

    const GetEventsAPI = environment.apiUrl + '/Event/GetPublicEventListSearch';

    const eventsRequestBody = {
      searchString: ''
    };

    this.http.post<GetPublicEventListSearchApiResponse>(GetEventsAPI, eventsRequestBody).subscribe(
      (res) => {
        this.searchedEvents = res.items
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

    const GetEventsAPI = environment.apiUrl + '/Event/GetPublicEventListSearch';

    const eventsRequestBody = {
      searchString: this.searchTerm
    };

    this.http.post<GetPublicEventListSearchApiResponse>(GetEventsAPI, eventsRequestBody).subscribe(
      (res) => {
        this.searchedEvents = res.items
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );

    const GetGroupsAPI = environment.apiUrl + '/Group/GetGroups';

    const requestBody = {
      filter: this.searchTerm,
      isPrivate: false,
      pageIndex: 1,
      pageSize: 1000,
    };

    this.http.post<ExploreGroupsApiResponse>(GetGroupsAPI, requestBody).subscribe(
      (res) => {
        this.publicGroups = res.filteredGroups
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );
  }

  navigateToGroupChat(groupId: string): void {
    this.Router.navigate(['/chat-group', groupId], {
      queryParams: { fromWhere: 'explore-search' }
    });
  }

  navigateToShowEventDetail(id: string) {
    this.Router.navigate(['show-event-detail'], { queryParams: { id: id } });
  }

  dateToJalali(date: string) {
    return moment(date, 'YYYY-MM-DD').locale('fa').format('dddd jD jMMMM jYYYY');
  }

  onTabChange(event: any): void {
    if (event.index === 0) {
    } else if (event.index === 1) {
    }
  }
}
