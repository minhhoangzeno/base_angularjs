import { Workspace } from '@/app/@core/interfaces/common/workspace';
import { PlanFlag } from '../../../@core/interfaces/business/plan';
import { Scenario } from '../../../@core/interfaces/business/scenario';

/** Reference ids attached to time series data points for the 'actual' areas. */
export const PLACEHOLDER_ACTUAL_ID = 'actual';
/** Reference ids attached to time series data points for the 'current' areas. */
export const PLACEHOLDER_CURRENT_ID = 'current';
/** Reference ids attached to time series data points for the 'committed' areas. */
export const PLACEHOLDER_COMMITTED_ID = 'committed';

export const LOCALSTORAGE_KEY_SELECTED_PLAN_ID = 'selected_plan_id';

/**
 * Generates a placeholder scenario of data from a given plan. Assigns values for "actual"
 * by default.
 */
export function createPlaceholderScenarioFromWorkspace(
  workspace: Workspace,
  override?: Partial<Scenario>,
): Scenario {
  const result: Scenario = {
    id: PLACEHOLDER_ACTUAL_ID,
    planRef: PlanFlag.ACTUAL,
    name: 'Actual',
    color: '#979797',
    inputDatabase: workspace.actualInputDatabase,
    outputDatabase: workspace.actualOutputDatabase,
    ...override,
  };

  return result;
}
