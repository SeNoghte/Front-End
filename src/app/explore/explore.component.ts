
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GroupItem, GroupsApiResponse, TagsApiResponse } from '../shared/models/group-model-type';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    HttpClientModule
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent {
  selectedChips: any[] = []; // Array to hold selected chips
  hideSingleSelectionIndicator = signal(true);
  tags!: string[]
  groups! : GroupItem[]


  ngOnInit() {
    const GetTagsAPI = environment.apiUrl + '/Event/GetMostUsedTagsList';

    this.http.post<TagsApiResponse>(GetTagsAPI, {}).subscribe(
      (res) => {
        console.log(res);
        this.tags = res.tags
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );
  }
  constructor(private Router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {

  }

  toggleTagSelection(tag: string): void {
    const index = this.selectedChips.indexOf(tag);

    if (index === -1) {
      // Tag not selected yet, add it
      this.selectedChips.push(tag);
    } else {
      // Tag already selected, remove it
      this.selectedChips.splice(index, 1);
    }

    console.log(this.selectedChips)
    this.fetchGroups();
  }


  fetchGroups(): void {
    const GetGroupsAPI = environment.apiUrl + '/Group/GetPublicGroupsListByTag';
    const newGroups: GroupItem[] = []; // Temporary array to hold unique groups
    const uniqueGroupIds = new Set<string>(); // Track unique group IDs

    if (this.selectedChips.length === 0) {
      this.groups = []; // Clear the groups
      return;
    }

    // Call the API for each selected tag and combine results
    this.selectedChips.forEach((tag) => {
      const requestBody = { tag };

      this.http.post<GroupsApiResponse>(GetGroupsAPI, requestBody).subscribe(
        (response) => {
          console.log(response)

          if (response.success) {
            response.items.forEach((group) => {
              if (!uniqueGroupIds.has(group.id)) {
                uniqueGroupIds.add(group.id); // Add ID to the set
                newGroups.push(group); // Add the unique group to the array
              }
            });
            this.groups = newGroups;
          } else {
            this.toastr.error(`Error fetching groups for tag: ${tag}`);
          }
        },
        (error) => {
          console.error(`Error calling API for tag: ${tag}`, error);
          this.toastr.error(`Error fetching groups for tag: ${tag}`);
        }
      );
    });
  }

  isTagSelected(tag: string): boolean {
    return this.selectedChips.includes(tag);
  }


  chips = [
    { id: 1, label: 'کوهنوردی', isSelected: false },
    { id: 2, label: 'ورزشی', isSelected: false },
    { id: 3, label: 'هنر', isSelected: false },
    { id: 3, label: 'پخش فوتبال', isSelected: false },
    { id: 3, label: 'وای', isSelected: false },
  ];

  suggested_groups = [
    { name: 'علی علوی' },
    { name: 'محمدحسین' },
    { name: 'سپهر' },
  ]

  toggleSelection(chip: any): void {
    chip.isSelected = !chip.isSelected;

    if (chip.isSelected) {
      this.selectedChips.push(chip);
    } else {
      this.selectedChips = this.selectedChips.filter(
        (selectedChip) => selectedChip !== chip
      );
    }

    console.log(this.selectedChips)
  }

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

  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }

  navigateToSearchExplore() {
    this.Router.navigate(['explore-search'])
  }
}
