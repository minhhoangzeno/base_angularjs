import { ObjectRef } from '../common/mongo';
import { EventVersion } from './event';
import { TaskStatus } from '../../backend/simcel/task.service';

export enum ScenarioFlag {
  ACTUAL = 'actual',
  COMMITTED = 'committed',
  CURRENT = 'current',
  PRIMARY = 'primary',
  FORECAST_BASE = 'forecast base',
}

/**
 * Defines a scenario. A scenario is calculated from a collection of associated events, which
 * produces a demand forecast that can be run on the simcel simulator.
 *
 * Check out this document for more information:
 * https://cel-coinnov.atlassian.net/wiki/spaces/SC/pages/547258371/Plans+Scenarios+Events
 */
export declare interface Scenario {
  id: string;
  name: string;
  planRef: string;
  inputDatabase?: string;
  outputDatabase?: string;
  color?: string;
  events?: Array<ObjectRef<EventVersion>>;
  // A list of task ids of task that are related to this scenario
  tasks?: string[];
  // Boolean value that will be true only when a blank scenario is created (in the scenarioc creation flow)
  blankScenario?: boolean;
  flags?: ScenarioFlag[];
  simulateWithUI?: boolean;

  /** Computed property, based on Plan's primary scenario */
  isPrimary?: boolean;
}

export declare interface ScenarioWithTaskStatus extends Scenario {
  // Summarised status of all the related tasks
  tasksSummary: {
    error?: string;
    status: TaskStatus;
  };
}
