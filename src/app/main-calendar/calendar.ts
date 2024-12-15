import { DateTypeListModel, DateType, CalendarTypeListModel, CalendarType, SeasonsModel, MonthsModel } from './calendar.model';

export const DateTypeList: DateTypeListModel[] = [
    { id: DateType.SolarHijri, name: "خورشیدی" },
    { id: DateType.Hijri, name: "قمری" },
    { id: DateType.Gregorian, name: "میلادی" }
];

export const CalendarTypeList: CalendarTypeListModel[] = [
    { id: CalendarType.occasion, name: "مناسبت" },
    { id: CalendarType.event, name: "رویداد" },
];

export const Seasons: SeasonsModel[] = [
    { name: "بهار", image: "/assets/seasons/spring.svg" },
    { name: "تابستان", image: "/assets/seasons/summer.svg" },
    { name: "پاییز", image: "/assets/seasons/fall.svg" },
    { name: "زمستان", image: "/assets/seasons/winter.svg" }
];

export const SolarHijriMonthsList: MonthsModel[] = [
    { id: 1, name: 'فروردین', countOfDays: 31, active: false },
    { id: 2, name: 'اردیبهشت', countOfDays: 31, active: false },
    { id: 3, name: 'خرداد', countOfDays: 31, active: false },
    { id: 4, name: 'تیر', countOfDays: 31, active: false },
    { id: 5, name: 'مرداد', countOfDays: 31, active: false },
    { id: 6, name: 'شهریور', countOfDays: 31, active: false },
    { id: 7, name: 'مهر', countOfDays: 30, active: false },
    { id: 8, name: 'آبان', countOfDays: 30, active: false },
    { id: 9, name: 'آذر', countOfDays: 30, active: false },
    { id: 10, name: 'دی', countOfDays: 30, active: false },
    { id: 11, name: 'بهمن', countOfDays: 30, active: false },
    { id: 12, name: 'اسفند', countOfDays: 30, active: false }
];

export const HijriMonthsList: MonthsModel[] = [
    { id: 1, name: 'محرم', countOfDays: 30, active: false },
    { id: 2, name: 'صفر', countOfDays: 30, active: false },
    { id: 3, name: 'ربيع الأول', countOfDays: 30, active: false },
    { id: 4, name: 'ربیع‌الثانی', countOfDays: 30, active: false },
    { id: 5, name: 'جمادى الأولى', countOfDays: 30, active: false },
    { id: 6, name: 'جمادى الآخرة', countOfDays: 30, active: false },
    { id: 7, name: 'رجب', countOfDays: 30, active: false },
    { id: 8, name: 'شعبان', countOfDays: 30, active: false },
    { id: 9, name: 'رمضان', countOfDays: 30, active: false },
    { id: 10, name: 'شوال', countOfDays: 30, active: false },
    { id: 11, name: 'ذو القعدة', countOfDays: 30, active: false },
    { id: 12, name: 'ذو الحجة', countOfDays: 30, active: false }
];

export const GregorianMonthsList: MonthsModel[] = [
    { id: 1, name: 'January', countOfDays: 30, active: false },
    { id: 2, name: 'February', countOfDays: 29, active: false },
    { id: 3, name: 'March', countOfDays: 31, active: false },
    { id: 4, name: 'April', countOfDays: 30, active: false },
    { id: 5, name: 'May', countOfDays: 31, active: false },
    { id: 6, name: 'June', countOfDays: 30, active: false },
    { id: 7, name: 'July', countOfDays: 31, active: false },
    { id: 8, name: 'August', countOfDays: 31, active: false },
    { id: 9, name: 'September', countOfDays: 30, active: false },
    { id: 10, name: 'October', countOfDays: 31, active: false },
    { id: 11, name: 'November', countOfDays: 30, active: false },
    { id: 12, name: 'December', countOfDays: 31, active: false }
];
