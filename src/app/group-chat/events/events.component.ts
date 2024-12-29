import { MainCalendarComponent } from '../../main-calendar/main-calendar.component';
import { CommonModule } from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse, GetGroupMessageListRequest, GetGroupMessageListResult, Group, GroupEvent, Message } from '../../shared/models/group-model-type';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    MainCalendarComponent,
    MatButtonToggleModule,
    CommonModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  @Input() GropEvents!: GroupEvent[];
  viewMode: 'calendar_view' | 'headline_view' = 'calendar_view';

  onToggleChange(value: 'calendar_view' | 'headline_view') {
    this.viewMode = value;
  }

  ngOnInit() {
    console.log("events in events : ", this.GropEvents)
  }

  constructor(
      private Router: Router,  
    ) { }

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

  hideSingleSelectionIndicator = signal(true);
  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }
  calendarView(){
    this.Router.navigate(['add-member']);
  }

  navigateToShowEventDetail(id : string){
    this.Router.navigate(['show-event-detail'], { queryParams: { id: id } });
  }
}
