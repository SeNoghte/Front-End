

export enum AccessLevel {
  Default,
  UserSpecific
}

export interface SearchFilter {
  title?: string;
  calendarType?: { occasion: boolean, event: boolean };
  dateType?: { SolarHijri: boolean };
  categories?: string[];
  tags?: string[] | string;
  day?: any;
  month?: any;
  year?: any;
  country?: string[] | string;
  sort?: string;
  page?: number;
  pageSize?: number;
  countAll?: number;
  dateTypeMonth?: any;
  unix?: number;
}

export interface SearchFilterParams {
  searchString?: string;
  calendarType?: string;
  dateType?: string;
  day?: string;
  month?: string;
  year?: string;
  selectedYearOnly?: boolean;
  today?: boolean;
  isAdmin?: boolean;
  notForget?: boolean;
  births?: boolean;
  categoryNames?: string[];
  categoryIds?: string[];
}

export interface SeasonsModel {
  name: string,
  image: string
}

export interface MonthsModel {
  id: number;
  name: string;
  countOfDays?: number;
  active: boolean;
  currentMonth?: boolean;
  unix?: number;
}

export interface YearsModel {
  name: number;
  active: boolean;
  unix?: number;
}

export interface CalendarTypeListModel {
  id: CalendarType;
  name: string;
}

export interface DateTypeListModel {
  id: DateType;
  name: string;
}

export enum DateType {
  SolarHijri = 1,
  Hijri = 2,
  Gregorian = 3
}

export enum CalendarType {
  occasion = 1,
  event = 2,
  Reminder = 3
}

export interface dayInMonthModel {
  unix: number;
  dayInSolarHijri: string;
  dayInWeek: string;
  active: boolean;
  currentToday?: boolean;
  notInMonth?: boolean;
  isHoliday?: boolean;
}

export interface calendarItemConfig {
  showTimerBox?: boolean;
  editable?: boolean;
  removable?: boolean;
  noteEditable?: boolean;
  noteRemovable?: boolean;
  empty?: boolean;
  accountView?: boolean;
  noteType?: boolean;
  interestType?: boolean;
  categoryAddable?: boolean;
}

export interface CalendarSelectModel {
  calendarId: string;
  title: string;
}

export class dynamicContentModel {
  btnText?: string;
  btnLink?: string;
  suggestionTitle?: string;
  suggestionImage?: string;
  suggestionLink?: string;
}

export interface GetCalendarsRequestModel {
  pageIndex: number;
  pageSize: number;
  searchString?: string;
  sortField?: string;
  count: boolean;
  doNotForgetOnly: boolean;
  types?: CalendarType[];
  acceptableDateTypes?: DateType[];
  countryIds?: number[];
  cityIds?: number[];
  categoryIds?: string[];
  selectedYearOnly?: boolean;
  likedOnly?: boolean;
  userNoteOnly?: boolean;
  includeCategories: boolean;
  includeUserNote?: boolean;
  getAll?: boolean;
  getNotExpiredEvents?: boolean;
}

export class GetAdminCalendarsRequestModel {
  pageIndex: number;
  pageSize: number;
  searchString?: string;
  sortField?: string;
  count: boolean;
  types?: CalendarType[];
  acceptableDateTypes?: DateType[];
  countryIds?: number[];
  cityIds?: number[];
  categoryIds?: string[];
  selectedYearOnly?: boolean;
  getAll?: boolean;
  includeNotPublished?: boolean;
  includePublished?: boolean;

  constructor(request: GetCalendarsRequestModel, includeNotPublished?: boolean, includePublished?: boolean) {
    this.pageIndex = request.pageIndex;
    this.pageSize = request.pageSize;
    this.searchString = request.searchString;
    this.sortField = request.sortField;
    this.count = request.count;
    this.types = request.types;
    this.acceptableDateTypes = request.acceptableDateTypes;
    this.countryIds = request.countryIds;
    this.cityIds = request.cityIds;
    this.categoryIds = request.categoryIds;
    this.selectedYearOnly = request.selectedYearOnly;
    this.getAll = request.getAll;
    this.includeNotPublished = includeNotPublished;
    this.includePublished = includePublished;
  }
}

export interface SaveDefaultCalendarRequestModel extends SaveUserCalendarRequestModel {
  isPublish: boolean;
  isFeature: boolean;
  dynamicContent?: string;
  dynamicLink?: string;
  suggestionImage?: string;
  suggestionLink?: string;
}

export interface SaveUserCalendarRequestModel {
  calendarId?: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  month: number;
  day: number;
  year?: number;
  toMonth?: number;
  toDay?: number;
  toYear?: number;
  calendarType: CalendarType;
  dateType: DateType;
  isHoliday: boolean;
  categoryIds: string[];
  cityId?: number;
  countryId?: number;
  tags: string[];
}

export interface GetSingleCalendarRequestModel {
  calendarId: string;
}

export interface GetMonthHolidaysRequestModel {
  month: number;
  year: number;
}


