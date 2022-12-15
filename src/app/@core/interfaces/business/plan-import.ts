import { Scenario } from './scenario';
import { Event } from './event';

/** Format of a S&OP plan import. */
export declare interface PlanImport {
  id: string;
  name: string;

  currentPlanStartDate: string;
  futurePlanStartDate: string;
  futurePlanEndDate: string;

  masterInputDatabase: string;
  uploadedAggregatedForecastDatabase: string;
  uploadedAggregatedEventsDatabase: string;

  previousPlanCycleId?: string;

  scenarios: Scenario[];
  events: Event[];
}
