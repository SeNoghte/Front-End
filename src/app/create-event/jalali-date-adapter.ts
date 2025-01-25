import { NativeDateAdapter } from '@angular/material/core';
import moment from 'jalali-moment';

export class JalaliDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const formatString = displayFormat === 'input' ? 'YYYY/MM/DD' : 'YYYY/MM/DD';
    return moment(date.toISOString()).locale('fa').format(formatString);
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && value) {
      const date = moment(value, 'YYYY/MM/DD').locale('fa').toDate();
      return date;
    }
    return null;
  }
}
