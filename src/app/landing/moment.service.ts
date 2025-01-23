import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateType, YearsModel, MonthsModel, dayInMonthModel } from './calendar.model';
import { ToastrService } from 'ngx-toastr';
import momentJalali from "jalali-moment";

@Injectable({
  providedIn: 'root'
})
export class MomentService {
  public timeSynced = new BehaviorSubject<void|null>(null);
  private serverTimeOffset = 0;

  constructor( private toastrService: ToastrService) {}

  yearList(_unix: number): YearsModel[] {

    const yearsList = new Array(11).fill(null).map((x, i) => {
      const unix = momentJalali(_unix).add(i - 5, 'jYear').unix();
      return {
        unix: unix,
        name: this.getCurrentYear(unix, DateType.SolarHijri),
        active: false
      }
    });
    return yearsList;
  }

  getYearList(year?: number): number[] {
    return Array.from(new Array(year ?? this.getCurrentYear() + 100), (x, i) => (i + 1));
  }

  getCurrentYear(unix?: number, type?: DateType): number {
    return this.getDateWithType(unix, type, "YYYY");
  }

  getDateWithType(unix?: number, type?: DateType, format?: string): number {
    unix = unix ? unix : this.getCurrentUnixDate();

    if (type === DateType.SolarHijri) {
      return +momentJalali(unix).locale("en").format(`j${format}`);
    }

    return 0;
  }

  getCurrentUnixDate(): number {
    return this.getCurrentTime().getTime();
  }

  public getCurrentTime(): Date {
    return new Date(Date.now() + this.serverTimeOffset);
  }

  getCurrentDay(unix?: number, type?: DateType): number {
    return this.getDateWithType(unix, type, "DD");
  }

  getCurrentMonth(unix?: number, type?: DateType): number {
    return this.getDateWithType(unix, type, "MM");
  }

  daysInMonth(_unix: number): dayInMonthModel[] {

    const currentMonthDates: dayInMonthModel[] = new Array(momentJalali(_unix).jDaysInMonth()).fill(null).map((x, i) => {
      const _date = momentJalali(_unix).startOf('jmonth').add(i, 'days');

      return {
        unix: _date.unix(),
        dayInSolarHijri: momentJalali(_date).format('jD'),
        dayInGregorian: momentJalali(_date).locale("en").format('DD'),
        dayInWeek: momentJalali(_date).locale('fa').format('dddd'),
        active: false
      }
    });

    return currentMonthDates;
  }

  toUnix(year: number, month: number, day: number, type?: DateType): any {

    year = year ? year : this.getCurrentYear(undefined, type);

    const input = `${year}.${month.toString().length == 1 ? `0${month}` : month}.${day.toString().length == 1 ? `0${day}` : day}`;

    let date = null;
    if (!year) {
      return 0;
    }

    if (type === DateType.SolarHijri) {
      date = +(momentJalali.from(input, "fa", 'jYYYY.jMM.jDD').locale("fa").unix() + "000");
    }

    return date;
  }

  get3Months(unix: number): number[] {
    if (!unix) {
      unix = this.getCurrentUnixDate();
    };
    const solarHijri = +momentJalali(unix).locale("en").format('jMM');
    return [solarHijri ];
  }

}