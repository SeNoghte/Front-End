import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EventsComponent } from "./events/events.component";
import { MessagesComponent } from './messages/messages.component';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, GetGroupMessageListRequest, GetGroupMessageListResult, Group, GroupEvent, Message } from '../shared/models/group-model-type';
import * as signalR from '@microsoft/signalr';
import { CommonModule } from '@angular/common';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    EventsComponent,
    MessagesComponent,
    HttpClientModule,
    CommonModule,
    MatButtonModule],
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent implements OnInit {
  defaultTabIndex = 0;
  messages: Message[] = [];
  group!: Group;
  GropEvents!: GroupEvent[];
  isLoading: boolean = true;
  fromWhere : string | null = '';
  groupId : string = '';
  isGroupPrivate : boolean = false;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private toastrService: ToastrService,
    private navVisibilityService: NavigationVisibilityService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.GetGroupInfo();
  }


  GetGroupInfo(): void {
    this.groupId = this.route.snapshot.paramMap.get('id')!!;
    if (!this.groupId) {
      this.toastrService.error('شناسه گروه یافت نشد.');
      return;
    }

    this.route.queryParams.subscribe(params => {
      this.defaultTabIndex = params['defaultNumber'] || 0; // Default to 0 if not provided
    });

    this.route.queryParamMap.subscribe((params) => {
      this.fromWhere = params.get('fromWhere');
    });

    const apiUrl = `https://api.becheen.ir:6001/api/Group/GetGroup`;
    const model = { groupId: this.groupId };

    this.http.post<ApiResponse>(apiUrl, model).subscribe({
      next: (response) => {
        if (response.success) {
          this.group = response.group;
          const { letter, color } = this.generateAvatar(this.group.name);
          this.group.avatarColor = color;
          this.group.avatarLetter = letter;
          this.isGroupPrivate = this.group.isPrivate;
          this.GropEvents = response.events as unknown as GroupEvent[];
        } else {
          this.toastrService.error(response.message);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastrService.error('مشکلی پیش آمد');
        console.error(error);
      },
    });
  }

  navigateToGroupInfo(): void {
    if (!this.group?.id) {
      this.toastrService.error('شناسه گروه موجود نیست.');
      return;
    }

    this.router.navigate(['/group-info', this.group.id]);
  }

  navigateToGroupPage(){
    if(this.fromWhere == null){
      this.router.navigate(['/group-page']);
    }
    else if(this.fromWhere == 'explore'){
      this.router.navigate(['/explore']);
    }
    else if(this.fromWhere == 'profile'){
      this.router.navigate(['/profile']);
    }
    else{
      this.router.navigate(['/explore-search']);
    }
  }

  onTabChange(event: any): void {
    // `event.index` gives the index of the selected tab
    if (event.index === 1) {
      // Show the navigation bar for Option 1
      this.navVisibilityService.show();
    } else if (event.index === 0) {
      // Hide the navigation bar for Option 2
      this.navVisibilityService.hide();
    }
  }

  redirectToGroupPage(){
    this.router.navigate(['group-page']);
  }

  generateAvatar(name: string): { letter: string; color: string } {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7',
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    ];

    const letter = name.charAt(0).toUpperCase();
    const color = colors[name.charCodeAt(0) % colors.length];
    return { letter, color };
  }

  // generateAvatar(name: string): { letter: string; color: string } {
  //   const colors = [
  //     '#F44336', '#E91E63', '#9C27B0', '#673AB7',
  //     '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
  //     '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  //     '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
  //   ];

  //   const letter = name.charAt(0).toUpperCase();
  //   const color = colors[name.charCodeAt(0) % colors.length];
  //   return { letter, color };
  // }
}

