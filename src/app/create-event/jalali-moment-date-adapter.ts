// import { Inject, Injectable, Optional } from '@angular/core';
// import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
// import moment, { Moment } from 'jalali-moment';

// @Injectable()
// export class JalaliMomentDateAdapter extends DateAdapter<Moment> {
//   constructor(@Optional() @Inject(MAT_DATE_LOCALE) public override locale: string) {
//     super();
//     moment.locale(this.locale || 'fa');
//   }

//   override parse(value: any, parseFormat: string | string[]): Moment | null {
//     if (value && typeof value === 'string') {
//       return moment(value, parseFormat, this.locale);
//     }
//     return value ? moment(value).locale(this.locale) : null;
//   }

//   override format(date: Moment, displayFormat: string): string {
//     if (!moment.isMoment(date)) {
//       throw new Error('Invalid Moment object');
//     }
//     return date.format(displayFormat);
//   }

//   override toIso8601(date: Moment): string {
//     return date.toISOString();
//   }

//   override isDateInstance(obj: any): boolean {
//     return moment.isMoment(obj);
//   }

//   override addCalendarMonths(date: Moment, months: number): Moment {
//     return date.clone().add(months, 'month');
//   }

//   override addCalendarDays(date: Moment, days: number): Moment {
//     return date.clone().add(days, 'day');
//   }

//   override getDayOfWeek(date: Moment): number {
//     return date.day();
//   }

//   override getMonth(date: Moment): number {
//     return date.month();
//   }

//   override getYear(date: Moment): number {
//     return date.year();
//   }

//   override getDate(date: Moment): number {
//     return date.date();
//   }

//   override createDate(year: number, month: number, date: number): Moment {
//     return moment().locale(this.locale).year(year).month(month).date(date);
//   }

//   override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
//     const months = moment.localeData(this.locale).months();
//     return months.map((month: string) => month);
//   }

//   override getDateNames(): string[] {
//     return Array.from({ length: 31 }, (_, i) => String(i + 1));
//   }

//   override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
//     const weekdays = moment.localeData(this.locale).weekdays();
//     return weekdays.map((day: string) => day);
//   }

//   override getYearName(date: Moment): string {
//     return date.format('jYYYY');
//   }

//   override clone(date: Moment): Moment {
//     return date.clone();
//   }

//   override today(): Moment {
//     return moment().locale(this.locale);
//   }

//   override valid(date: Moment): boolean {
//     return date.isValid();
//   }

//   override getFirstDayOfWeek(): number {
//     return moment.localeData(this.locale).firstDayOfWeek();
//   }

//   override getNumDaysInMonth(date: Moment): number {
//     return date.daysInMonth();
//   }
// }
