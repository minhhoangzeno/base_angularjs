import { NbCalendarRange } from '@nebular/theme';
import { compareAsc, format, parse } from 'date-fns';

import { SimpleDateRange } from '@/app/@core/interfaces/common/date-range';

export function convertToCalendarRange(dateRange?: SimpleDateRange): NbCalendarRange<Date> | null {
  if (!dateRange) return null;
  return {
    start: new Date(dateRange.start),
    end: new Date(dateRange.end),
  };
}

export function convertToSimpleDateRange(calendarRange: NbCalendarRange<Date>): SimpleDateRange {
  return {
    start: calendarRange.start.toLocaleString('sv', { timeZoneName: 'short' }).slice(0, 10),
    end: calendarRange.end?.toLocaleString('sv', { timeZoneName: 'short' })?.slice(0, 10) || '',
  };
}

export const parseYYYYMMDD = (s: string) => parse(s, 'yyyy-MM-dd', new Date());
export const formatYYYYMMDD = (d: Date) => format(d, 'yyyy-MM-dd');

export function convertToRangePickerVal(dateRange?: SimpleDateRange): Date[] {
  if (!dateRange) return [];
  return [parseYYYYMMDD(dateRange.start), parseYYYYMMDD(dateRange.end)];
}

export function convertToSimpleDateRangeFromRangepickerVal(range: Date[]): SimpleDateRange {
  return {
    start: range[0] ? formatYYYYMMDD(range[0]) : '',
    // Below is the previous code. Variable range is an array of 2 elements with start time and end time
    // In there, start is range[0] so end range[1]
    // I fixed it after seeing someone made a mistake : end : range[0]
    // end: range[0] ? formatYYYYMMDD(range[1]) : '', 
    end: range[1] ? formatYYYYMMDD(range[1]) : '',
  };
}

export function sortByDateProp(a: { date?: Date }, b: { date?: Date }) {
  if (!a.date && !b.date) return 0;
  if (!a.date) return -1;
  if (!b.date) return 1;
  return compareAsc(a.date, b.date);
}
