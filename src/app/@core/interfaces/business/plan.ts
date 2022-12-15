import { Scenario } from './scenario';
import { Event } from './event';
import { ObjectRef } from '../common/mongo';
import { Workspace } from '../common/workspace';
import { TaskStatus } from '../../backend/simcel/task.service';

export enum PlanFlag {
  ACTUAL = 'actual',
}

/**
 * Defines a S&OP plan.
 *
 * For more detailed information, checkout the doc at:
 * https://cel-coinnov.atlassian.net/wiki/spaces/SC/pages/554467367/Database+Modelling
 */
export declare interface Plan {
  id: string;
  name: string;

  currentPlanStartDate: string;
  currentPlanEndDate: string;
  futurePlanStartDate: string;
  futurePlanEndDate: string;
  defaultPlanDisplayStartDate: string;
  defaultPlanDisplayEndDate: string;

  masterInputDatabase: string;
  demandInputDatabase: string;

  previousPlanCycle?: ObjectRef<Plan>;
  primaryScenario?: ObjectRef<Scenario>;

  scenarios: ObjectRef<Scenario>[];
  events: ObjectRef<Event>[];
  workspace: Workspace;

  /** Supposed to be SegmentSelection, but it's going to be revised soon. */
  segments: ObjectRef<any>[];

  flags?: PlanFlag[];
  company: string;
  // A list of task ids of task that are related to this Plan
  tasks?: string[];

  // an obs storing a summarised status of all the related tasks
  tasksSummary?: {
    error?: string;
    status: TaskStatus;
  };
}

/** Sorts the list of plan from latest plan start date to earliest, with "Actual" at the end. */
export function sortPlansByStartDate(plans: Array<Plan>): Plan[] {
  return (plans || []).sort((a, b) => {
    if (a?.flags?.includes(PlanFlag.ACTUAL)) {
      return 1;
    }
    if (b?.flags?.includes(PlanFlag.ACTUAL)) {
      return -1;
    }
    return b?.futurePlanStartDate?.localeCompare(a?.futurePlanStartDate);
  });
}
