import { Component } from '@angular/core';
import { MainCalendarComponent } from '../../main-calendar/main-calendar.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [MainCalendarComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {

}
