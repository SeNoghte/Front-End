import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { EventsComponent } from "./events/events.component";
import { MessagesComponent } from './messages/messages.component';

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatTabsModule, EventsComponent,MessagesComponent,HttpClientModule],
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent {
  
}

