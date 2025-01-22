
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { EventItem, EventsApiResponse, GroupItem, GroupsApiResponse, TagsApiResponse } from '../shared/models/group-model-type';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment-jalaali';

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
  groups!: GroupItem[]
  events!: EventItem[]

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

    this.fetchAllGroups();
    this.fetchAllEvents();
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
    this.fetchEvents();
  }

  navigateToGroupChat(groupId: string): void {
    this.Router.navigate(['/chat-group', groupId ], {
      queryParams: { fromWhere: 'explore' }
    });
  }
  
  navigateToShowEventDetail(id : string){
    this.Router.navigate(['show-event-detail'], { queryParams: { id: id } });
  }

  fetchGroups(): void {
    const GetGroupsAPI = environment.apiUrl + '/Group/GetPublicGroupsListByTag';
    const newGroups: GroupItem[] = []; // Temporary array to hold unique groups
    const uniqueGroupIds = new Set<string>(); // Track unique group IDs

    if (this.selectedChips.length === 0) {
      this.fetchAllGroups()
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

  fetchEvents(): void {
    const GetEventsAPI = environment.apiUrl + '/Event/GetPublicTasksListByTag';

    // If no tags are selected, clear the events and return
    if (this.selectedChips.length === 0) {
      this.fetchAllEvents()
      return;
    }

    const uniqueEventIds = new Set<string>(); // Track unique event IDs
    const newEvents: EventItem[] = []; // Temporary array to hold unique events

    // Call the API for each selected tag and combine results
    this.selectedChips.forEach((tag) => {
      const requestBody = { tag };

      this.http.post<EventsApiResponse>(GetEventsAPI, requestBody).subscribe(
        (response) => {
          if (response.success) {
            response.items.forEach((event) => {
              if (!uniqueEventIds.has(event.id)) {
                uniqueEventIds.add(event.id); // Add ID to the set
                newEvents.push(event); // Add the unique event to the array
              }
            });
            this.events = newEvents; // Update events with unique events
          } else {
            this.toastr.error(`Error fetching events for tag: ${tag}`);
          }
        },
        (error) => {
          console.error(`Error calling API for tag: ${tag}`, error);
          this.toastr.error(`Error fetching events for tag: ${tag}`);
        }
      );
    });
  }

  fetchAllEvents(): void {
    const GetEventsAPI = environment.apiUrl + '/Event/GetPublicTasksListByTag';
    const uniqueEventIds = new Set<string>(); // Track unique event IDs
    const newEvents: EventItem[] = []; // Temporary array to hold unique events

    // Call the API for each selected tag and combine results
    const requestBody = { tag: "" };

    this.http.post<EventsApiResponse>(GetEventsAPI, requestBody).subscribe(
      (response) => {
        if (response.success) {
          response.items.forEach((event) => {
            if (!uniqueEventIds.has(event.id)) {
              uniqueEventIds.add(event.id); // Add ID to the set
              newEvents.push(event); // Add the unique event to the array
            }
          });
          this.events = newEvents; // Update events with unique events
        } else {
          this.toastr.error(`Error fetching events`);
        }
      },
      (error) => {
        console.error(`Error calling API`, error);
        this.toastr.error(`Error fetching events `);
      }
    );
  }

  fetchAllGroups() {
    const GetGroupsAPI = environment.apiUrl + '/Group/GetPublicGroupsListByTag';
    const newGroups: GroupItem[] = []; // Temporary array to hold unique groups
    const uniqueGroupIds = new Set<string>(); // Track unique group IDs

    const requestBody = { tag: "" };

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
          this.toastr.error(`Error fetching groups`);
        }
      },
      (error) => {
        console.error(`Error calling API`, error);
        this.toastr.error(`Error fetching groups`);
      }
    );
  }

  isTagSelected(tag: string): boolean {
    return this.selectedChips.includes(tag);
  }

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

  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }

  navigateToSearchExplore() {
    this.Router.navigate(['explore-search'])
  }

  dateToJalali( date : string ){
    return moment(date, 'YYYY-MM-DD').locale('fa').format('dddd jD jMMMM jYYYY');
  }
}
