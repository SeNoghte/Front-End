import { MainCalendarComponent } from '../../main-calendar/main-calendar.component';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse, GetGroupMessageListRequest, GetGroupMessageListResult, Group, GroupEvent, Message } from '../../shared/models/group-model-type';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment-jalaali';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    MainCalendarComponent,
    MatButtonToggleModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  @Input() GropEvents!: GroupEvent[];
  @Input() isPrivate!: boolean;
  @Input() isAdmin!: boolean;
  
  viewMode: 'calendar_view' | 'headline_view' = 'headline_view';

  onToggleChange(value: 'calendar_view' | 'headline_view') {
    this.viewMode = value;
  }

  ngOnInit() {
  }

  constructor(
    private Router: Router,
    private route: ActivatedRoute,
  ) { }

  hideSingleSelectionIndicator = signal(true);
  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }
  calendarView() {
    this.Router.navigate(['add-member']);
  }

  navigateToShowEventDetail(id: string) {
    this.Router.navigate(['show-event-detail'], { queryParams: { id: id } });
  }

  addEvent() {
    const groupId = this.route.snapshot.paramMap.get('id');
    this.Router.navigate(['create-event'], { queryParams: { id: groupId, isPrivate: this.isPrivate } });
  }

  dateToJalali(date: string) {
    const formattedDate = date.substring(6,10)+'-'+date.substring(0,2)+'-'+date.substring(3,5);
    return moment(formattedDate, 'YYYY-MM-DD').locale('fa').format('dddd jD jMMMM jYYYY');
  }
}
