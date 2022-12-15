import { Scenario } from '../../../@core/interfaces/business/scenario';
import { Timeseries } from '../../../@core/interfaces/business/timeseries';

export interface ScenarioResults {
  scenario: Scenario;
  timeseries: Timeseries;
}
