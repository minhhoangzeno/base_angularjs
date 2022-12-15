import { forkJoin, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  BreakdownService,
  CURRENT_PLAN_ENDPOINT,
  COMMITTED_PLANS_ENDPOINT,
} from '../../../@core/entity/breakdown.service';
import {
  Breakdown,
  emptyBreakdown,
  mergeBreakdowns,
} from '../../../@core/interfaces/business/breakdown';
import { Plan } from '../../../@core/interfaces/business/plan';
import { Segment } from '../../../@core/interfaces/business/segment';
import { Scenario, ScenarioFlag } from '../../../@core/interfaces/business/scenario';
import { fromBreakdowns } from '../../../@core/interfaces/business/timeseries';
import { SimpleDateRange, intersection } from '../../../@core/interfaces/common/date-range';
import { PlanningExplorerScenarioResults } from './planning-explorer.models';

/**
 * Modify numeric data from a breakdown for mocking the results. Refer to the linked asana
 * task for more information: https://app.asana.com/0/1171584194938875/1190037091328809
 *
 * TODO(nathanielcapule): This is a temporary change. Remove on production.
 */
export function distortBreakdownData(breakdown: Breakdown, multiplier: number): Breakdown {
  return {
    ...breakdown,
    cogs: breakdown.cogs * multiplier,
    demandValue: breakdown.demandValue * multiplier,
    discountsRebates: breakdown.discountsRebates * multiplier,
    distributionCost: breakdown.distributionCost * multiplier,
    grossSalesValue: breakdown.grossSalesValue * multiplier,
    handlingCost: breakdown.handlingCost * multiplier,
    netSalesValue: breakdown.netSalesValue * multiplier,
    storageCost: breakdown.storageCost * multiplier,
    transferCost: breakdown.transferCost * multiplier,
  };
}

/** Load and populate PlanningExplorerScenario from a given scenario reference. */
export function loadPlanningExplorerFromScenario(
  plan: Plan,
  scenario: Scenario,
  breakdownService: BreakdownService,
  options?: {
    segment: Segment;
    dateRange: SimpleDateRange;
  },
): Observable<PlanningExplorerScenarioResults> {
  let customEndpoint: string | null = null;

  // Special handler for loading dataset of committed plans scenario.
  if ((scenario.flags || []).includes(ScenarioFlag.COMMITTED)) {
    customEndpoint = COMMITTED_PLANS_ENDPOINT;
    // Limits the datapoints retrieved from committed plans with actualStartDate and
    // futurePlanStartDate.
    if (options)
      options.dateRange = intersection(options.dateRange, {
        start: plan.workspace.actualStartDate,
        end: plan.futurePlanEndDate,
      });
  }
  // Special handler for loading dataset of actual scenario.
  if ((scenario.flags || []).includes(ScenarioFlag.ACTUAL)) {
    // Early exit if we want to load data for actual scenario, since 'Actual' is already
    // retrieved from the parent planning explorer state.
    return observableOf({
      scenario,
      breakdown: emptyBreakdown(),
      timeseries: fromBreakdowns(scenario.id, []),
    });
  }
  // Special handler for loading dataset of current scenario.
  if ((scenario.flags || []).includes(ScenarioFlag.CURRENT)) {
    customEndpoint = CURRENT_PLAN_ENDPOINT;
    if (options)
      options.dateRange = intersection(options.dateRange, {
        start: plan.currentPlanStartDate,
        end: plan.currentPlanEndDate,
      });
  }

  const breakdownObs = breakdownService
    .getWithPostQuery(
      { database: scenario.outputDatabase || '' },
      {
        ...options,
        segmentDatabase: scenario.inputDatabase,
        companyId: plan.company,
        planId: plan.id,
      },
      {},
      customEndpoint || '',
    )
    .pipe(
      map((arr) => arr.map((v) => ({ ...v, id: scenario.id }))),
      map((arr) => mergeBreakdowns(...arr) || emptyBreakdown()),
    );

  const timeseriesObs = breakdownService
    .getWithPostQuery(
      { database: scenario.outputDatabase || '' },
      {
        ...options,
        segmentDatabase: scenario.inputDatabase,
        companyId: plan.company,
        interval: 'day',
        planId: plan.id,
      },
      {},
      customEndpoint || '',
    )
    .pipe(map((arr) => fromBreakdowns(scenario.id, arr)));

  return forkJoin([observableOf(scenario), breakdownObs, timeseriesObs]).pipe(
    map(([scenario, breakdown, timeseries]) => ({
      scenario,
      breakdown,
      timeseries,
    })),
  );
}
