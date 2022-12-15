import { Breakdown } from '../../../@core/interfaces/business/breakdown';
import { ScenarioResults } from '../shared/explorer.models';

/** Container for a single displayed scenario in planning explorer. */
export interface PlanningExplorerScenarioResults extends ScenarioResults {
  breakdown?: Breakdown;
}
