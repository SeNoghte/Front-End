import { Component } from '@angular/core';
import { SolarHijriMonthsList, Seasons } from './calendar';
import { MonthsModel, dayInMonthModel, SeasonsModel, DateType } from './calendar.model';
import { MomentService } from './moment.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import moment from 'jalali-moment';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
// import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzPopoverModule } from 'ng-zorro-antd/popover'

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HttpClientModule,
    // NzButtonModule,
    // NzPopoverModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  visible: string | null = null;
  monthList: MonthsModel[] = SolarHijriMonthsList;
  dayList: dayInMonthModel[] = [];
  yearList: number[] = [];
  eventList: Event[] = [];
  Seasons: SeasonsModel[] = Seasons;
  Season: SeasonsModel = this.Seasons[0];
  dateEvent: DateEventGroup[] = [];

  matchingMonth: any;
  CurrentUnix: number = 0;
  CurrentYear: number = 0;
  CurrentMonth: number = 0;
  CurrentDay: number = 0;
  eventWithImage: string = "";
  dayDate: number = 0;
  MonthDate: number = 0;
  YearDate: number = 0;
  groupId: string = "";

  constructor(
    public readonly momentService: MomentService, private http: HttpClient, private toastr: ToastrService, private route: ActivatedRoute,
  ) { }

  change(id: string): void {
    Number(this.visible) === Number(id) ? null : id;
  }

  public get DateType() {
    return DateType;
  }

  weeks: dayInMonthModel[][] = [];
  daysOfWeek: string[] = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
  private _daysOfWeek: string[] = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  yearMonthChanged: Subject<boolean> = new Subject<boolean>();

  weeksByMonth: { month: MonthsModel; weeks: dayInMonthModel[][] }[] = [];



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.momentService.timeSynced.subscribe(() => {
        this.goToday();
    });
    this.yearList = this.momentService.getYearList()
    const GetEventsApiUrl = 'https://api.becheen.ir:6001/api/Event/GetMyEvents';
    const payload = {
      groupId: id,
    };
    this.http.post(GetEventsApiUrl, payload).subscribe((res: any) => {
      this.eventList = res.myEvents;
      
      const groupedEvents: { yearEvent: number; monthEvent: number; dayEvent: number; events: any[] }[] = [];

      for (const event of this.eventList) {
        const { letter, color } = this.generateAvatar(event.title);
        const date = event.date.split(' ')[0];
        const jalaliDate = moment(date).locale('fa').format('YYYY/M/D');
        const [year, month, day] = jalaliDate.split('/').map(Number);

        let group = groupedEvents.find(
          (g) => g.yearEvent === year && g.monthEvent === month && g.dayEvent === day
        );

        if (!group) {
          group = { yearEvent: year, monthEvent: month, dayEvent: day, events: [] };
          groupedEvents.push(group);
        }

        group.events.push({
          ...event,
          yearEvent: year,
          monthEvent: month,
          dayEvent: day,
          avatarLetter: letter,
          avatarColor: color,
        });
      }
      this.dateEvent = groupedEvents;
    });
  }

  hasEventForDay(monthId: number, day: string): { hasEvent: boolean; count: number, list: Event[]} {
    const eventsForDay = this.dateEvent.filter(event =>
      event.monthEvent === monthId && event.dayEvent.toString() === day
    );
    
    const eventsList = eventsForDay.flatMap(item =>
      Array.isArray(item.events) ? item.events : []
    );

    const count = eventsForDay.reduce((total, event) => {
      return total + (Array.isArray(event.events) ? event.events.length : 0);
    }, 0);
    return {
      hasEvent: count > 0,
      count: count,
      list: eventsList,
    };
  }

  getBackgroundImage(monthId: number, day: string): string | null {
    const dateEventGroup = this.dateEvent.find(
      (group: DateEventGroup) => group.monthEvent === monthId && group.dayEvent.toString() === day
    );

    if (dateEventGroup && dateEventGroup.events.length > 0) {
      const eventWithImage = dateEventGroup.events.find(
        (event: Event) => event.imagePath
      );
      return eventWithImage ? eventWithImage.imagePath : null;
    }
    return null;
  }

  ngOnDestroy() {
    this.yearMonthChanged.unsubscribe();
  }

  changeSeason() {
    if ([1, 2, 3].includes(this.CurrentMonth)) {
      this.Season = this.Seasons[0];
    } else if ([4, 5, 6].includes(this.CurrentMonth)) {
      this.Season = this.Seasons[1];
    } else if ([7, 8, 9].includes(this.CurrentMonth)) {
      this.Season = this.Seasons[2];
    } else if ([10, 11, 12].includes(this.CurrentMonth)) {
      this.Season = this.Seasons[3];
    }
  }

  calcCalendar(yearMonthChanged: boolean = false) {
    this.CurrentDay = +this.momentService.getCurrentDay(this.CurrentUnix, DateType.SolarHijri);
    if (!yearMonthChanged) {
      var i = 1;
      this.weeks.forEach(week => week.forEach(day => {
        if (!day.notInMonth) {
          day.active = i == this.CurrentDay;
          ++i;
        }
      }));
      return;
    }

    this.CurrentMonth = +this.momentService.getCurrentMonth(this.CurrentUnix, DateType.SolarHijri);
    this.CurrentYear = +this.momentService.getCurrentYear(this.CurrentUnix, DateType.SolarHijri);
    this.weeksByMonth = [];

    this.monthList.forEach((month) => {
      const monthId = month.id;
      this.changeSeason();

      const daysInMonth: dayInMonthModel[] = this.momentService.daysInMonth(this.momentService.toUnix(this.CurrentYear, monthId, 1, DateType.SolarHijri));
      daysInMonth.forEach(f => {
        f.active = +f.dayInSolarHijri == this.CurrentDay;
      });

      const previousDays = this._daysOfWeek.indexOf(daysInMonth[0].dayInWeek) + 1;
      const nextDays = this.daysOfWeek.length - this._daysOfWeek.indexOf(daysInMonth.at(-1)?.dayInWeek ?? '') - 1;
      const weeksCount = Math.floor((previousDays + nextDays + daysInMonth.length) / 7);
      const weeks: dayInMonthModel[][] = Array.from({ length: weeksCount }, () => []);
      this.weeks = [];
      for (var i = 0; i < weeksCount; ++i) {
        this.weeks[i] = [];
      }

      var _day = 0;
      // Filling the first week
      if (daysInMonth[0].dayInWeek != this._daysOfWeek[0]) {
        const _lastYear = monthId == 1;
        const previousMonth: dayInMonthModel[] = this.momentService.daysInMonth(
          this.momentService.toUnix(
            _lastYear ? this.CurrentYear - 1 : this.CurrentYear, _lastYear ? 12 : monthId - 1, this.CurrentDay, DateType.SolarHijri));

        for (var i = previousMonth.length - 1, j = previousDays - 2; j >= 0; --i, --j) {
          weeks[0][j] = { ...previousMonth[i], notInMonth: true };
        }

        for (var i = previousDays - 1; daysInMonth[_day].dayInWeek != this.daysOfWeek[0]; ++_day, ++i) {
          weeks[0][i] = daysInMonth[_day];
        }
      }
      else {
        for (; _day < this.daysOfWeek.length; ++_day) {
          weeks[0][_day] = daysInMonth[_day];
        }
      }

      // Weeks in between
      for (var i = 1; i < weeksCount - 1; ++i) {
        for (var j = 0; j < this.daysOfWeek.length; ++j, ++_day) {
          weeks[i][j] = daysInMonth[_day];
        }
      }

      // Filling the last week
      if (Number(daysInMonth.at(-1)?.dayInWeek) !== Number(this._daysOfWeek.at(-1))) {
        const _nextYear = monthId == 12;
        const nextMonth: dayInMonthModel[] = this.momentService.daysInMonth(
          this.momentService.toUnix(
            _nextYear ? this.CurrentYear + 1 : this.CurrentYear, _nextYear ? 1 : monthId + 1, this.CurrentDay, DateType.SolarHijri));


        for (var i = 0; _day < daysInMonth.length; ++_day, ++i) {
          weeks[weeksCount - 1][i] = daysInMonth[_day];
        }

        for (var i = 0, j = this.daysOfWeek.length - nextDays; j < this.daysOfWeek.length; ++i, ++j) {
          weeks[weeksCount - 1][j] = { ...nextMonth[i], notInMonth: true };
        }
      }
      else {
        for (var i = 0; i < daysInMonth.length; ++i, ++_day) {
          weeks[weeksCount - 1][i] = daysInMonth[_day];
        }
      }
      this.weeksByMonth.push({ month, weeks });
    });
    this.yearMonthChanged.next(true);
  }

  goToday() {
    this.calcCalendar(true);
    this.CurrentUnix = +this.momentService.getCurrentUnixDate();
    const currentMonth = this.momentService.getCurrentMonth(this.CurrentUnix, DateType.SolarHijri);
    this.matchingMonth = this.weeksByMonth?.find(item => item.month.id === currentMonth);
  }

  beforeMonth(id: number) {
    if(id>1){
      id -= 1
      this.matchingMonth = this.weeksByMonth?.find(item => item.month.id === id);
    }
  }

  nextMonth(id: number) {
    if(id<12){
      id += 1
      this.matchingMonth = this.weeksByMonth?.find(item => item.month.id === id);
    }
  }

  changeMonth(month: MonthsModel) {
    if (month.id != this.CurrentMonth) {
      this.CurrentUnix = this.momentService.toUnix(this.CurrentYear, month.id, this.CurrentDay, DateType.SolarHijri);
      this.calcCalendar(true);
    }
  }

  changeDay(day: dayInMonthModel) {
    if (this.CurrentUnix != day.unix * 1000) {
      this.CurrentUnix = day.unix * 1000;
      this.calcCalendar(day.notInMonth);
    }
  }

  changeYear(year: number) {
    if (this.CurrentYear != year) {
      this.CurrentUnix = this.momentService.toUnix(year, this.CurrentMonth, this.CurrentDay, DateType.SolarHijri);
      this.calcCalendar(true);
    }
  }

  convertToPersianDigits(value: string | number): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return value
      .toString()
      .replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
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

}

interface User {
  userId: string;
  name: string;
  username: string;
  email: string;
  joinedDate: string;
  image: string;
  aboutMe: string;
}

interface Event {
  id: string;
  description: string;
  owner: User;
  date: string;
  time: string;
  groupId: string;
  imagePath: string;
  members: User[];
  avatarLetter: string,
  avatarColor: string,
  yearEvent: number;
  monthEvent: number;
  dayEvent: number;
  title: string;
}

interface DateEventGroup {
  yearEvent: number;
  monthEvent: number;
  dayEvent: number;
  events: Event[];
}

