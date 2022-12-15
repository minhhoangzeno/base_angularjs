import { select_highlightedScenario } from '@/store/scenario/scenario.selectors';
import { createSelector } from '@ngrx/store';
import { select_selectedSegment } from '../layout/layout.baseSelectors';
import { select_selectedDateRange } from '../layout/layout.selectors';

export const select_suppyChartParams = createSelector(
  select_highlightedScenario,
  select_selectedSegment,
  select_selectedDateRange,
  (highlighted, selectedSegment, dateRange) => {
    const outputDbName = highlighted?.outputDatabase;
    const inputDbName = highlighted?.inputDatabase;
    if (!outputDbName || !inputDbName || !dateRange) {
      return null;
    }
    const startDate = dateRange.start;
    const endDate = dateRange.end;
    // differenceInDays
    // will use a library to replace the following line
    const duration = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (24 * 3600 * 1000),
    );
    const obj = {
      segment: JSON.stringify(selectedSegment),
      simcelOutputDb: outputDbName,
      simcelInputDb: inputDbName,
      startDate: startDate,
      duration: duration,
    };

    return obj;
  },
);
