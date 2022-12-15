import { createSelector } from '@ngrx/store';

import { environment } from '@/environments/environment';
import {
  select_displayingScenarios,
  select_legacy_actualAndCommittedScenarios,
} from '@/store/scenario/scenario.selectors';
import { select_selectedPlan } from '../layout/layout.selectors';
import { PlanFlag } from '@/app/@core/interfaces/business/plan';

export const select_profitExplorerURL = createSelector(
  select_selectedPlan,
  select_displayingScenarios,
  select_legacy_actualAndCommittedScenarios,
  (selectedPlan, displayingScenarios, legacy_actualAndCommittedScenarios) => {
    if (!selectedPlan) return '';

    const ids = selectedPlan.flags?.includes(PlanFlag.ACTUAL)
      ? legacy_actualAndCommittedScenarios.map((s) => s.id)
      : displayingScenarios.map((s) => s.id);

    return `${environment.profitExplorerUrl}?scenario_id=${ids.join(',')}`;
  },
);
