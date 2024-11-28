import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { EventsComponent } from "./events/events.component";
import { MessagesComponent } from './messages/messages.component';
import { HttpClient } from '@microsoft/signalr';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [
      MatToolbarModule,
      MatIconModule,
      MatTabsModule,
      MessagesComponent,
      HttpClientModule,
      EventsComponent
    ],
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent {
  constructor(
    private navVisibilityService: NavigationVisibilityService,
  ) {

  }

  ngOnInit(): void {
    this.navVisibilityService.show();
  }

  onTabChange(event: any): void {
    // `event.index` gives the index of the selected tab
    if (event.index === 0) {
      // Show the navigation bar for Option 1
      this.navVisibilityService.show();
    } else if (event.index === 1) {
      // Hide the navigation bar for Option 2
      this.navVisibilityService.hide();
    }
  }
}

