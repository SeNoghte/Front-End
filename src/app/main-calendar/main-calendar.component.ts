import { Component } from '@angular/core';
import { SolarHijriMonthsList, Seasons } from './calendar';
import { MonthsModel, dayInMonthModel, SeasonsModel, DateType } from './calendar.model';
import { MomentService } from './moment.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { pipe, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import moment from 'jalali-moment';
import { ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-main-calendar',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,

  ],
  templateUrl: './main-calendar.component.html',
  styleUrl: './main-calendar.component.scss'
})
export class MainCalendarComponent {
  monthList: MonthsModel[] = SolarHijriMonthsList;
  dayList: dayInMonthModel[] = [];
  yearList: number[] = [];
  eventList: Event[] = [];
  Seasons: SeasonsModel[] = Seasons;
  Season: SeasonsModel = this.Seasons[0];
  dateEvent: DateEventGroup[] = [];

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
    })
    this.yearList = this.momentService.getYearList()
    const GetEventsApiUrl = 'https://api.becheen.ir:6001/api/Group/GetGroup';
    const payload = {
      groupId: id,
    };
    this.http.post(GetEventsApiUrl, payload).subscribe((res: any) => {
      this.eventList = res.events;

      const groupedEvents: { yearEvent: number; monthEvent: number; dayEvent: number; events: any[] }[] = [];

      for (const event of this.eventList) {
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
        });
      }
      this.dateEvent = groupedEvents;
    });
  }

  hasEventForDay(monthId: number, day: string): { hasEvent: boolean; count: number } {
    const eventsForDay = this.dateEvent.filter(event =>
      event.monthEvent === monthId && event.dayEvent.toString() === day
    );
    const count = eventsForDay.reduce((total, event) => {
      return total + (Array.isArray(event.events) ? event.events.length : 0);
    }, 0);
    return {
      hasEvent: count > 0,
      count: count
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
    this.CurrentUnix = +this.momentService.getCurrentUnixDate();
    this.calcCalendar(true);
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
  title: string;
  description: string;
  owner: User;
  date: string;
  time: string;
  groupId: string;
  imagePath: string;
  members: User[];
  yearEvent: number;
  monthEvent: number;
  dayEvent: number;
}

interface DateEventGroup {
  yearEvent: number;
  monthEvent: number;
  dayEvent: number;
  events: Event[];
}
