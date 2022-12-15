import { range } from "rambda";

/** Date range with start and end date of format YYYY-MM-DD. */
export declare interface SimpleDateRange {
  start: string;
  end: string;
}

function min(a: string, b: string) {
  if (!a) return b;
  if (!b) return a;
  if (a > b) return b;
  return a;
}

function max(a: string, b: string) {
  if (!a) return b;
  if (!b) return a;
  if (a > b) return a;
  return b;
}

/** Returns the intersection of two given date ranges. */
export function intersection(a?: SimpleDateRange, b?: SimpleDateRange): SimpleDateRange {
  if (!a && !b) throw new Error('Invalid Date Range');
  if (!a || !b) return a || b || { start: '', end: '' };

  const start = max(a.start, b.start);
  const end = min(a.end, b.end);
  return { start, end };
}

export function simpleDateRangeComparer(
  previousRange: SimpleDateRange,
  currentRange: SimpleDateRange,
) {
  return previousRange.start === currentRange.start && previousRange.end === currentRange.end;
}

export function simpleDateRangeChanged(arr: Array<SimpleDateRange | undefined>) {
  let previous: SimpleDateRange | undefined = undefined;
  for (const range of arr) {
    if (!range) continue;
    if (!previous) {
      previous = range;
      continue;
    }
    if (!simpleDateRangeComparer(range, previous)) return true;
  }
  return false;
}
