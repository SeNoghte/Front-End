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

  messages: Message[] = [];
  group!: Group;
  GropEvents!: GroupEvent[];
  isLoading: boolean = true;

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
    const groupId = this.route.snapshot.paramMap.get('id');
    if (!groupId) {
      this.toastrService.error('شناسه گروه یافت نشد.');
      return;
    }

    const apiUrl = `https://api.becheen.ir:6001/api/Group/GetGroup`;
    const model = { groupId: groupId };

    this.http.post<ApiResponse>(apiUrl, model).subscribe({
      next: (response) => {
        if (response.success) {
          this.group = response.group;
          this.GropEvents = response.events as unknown as GroupEvent[];
          console.log(this.GropEvents)
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
    this.router.navigate(['/group-page']);
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
}

