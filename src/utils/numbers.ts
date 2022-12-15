import { Plan } from "@/app/@core/interfaces/business/plan";
import { Workspace } from "@/app/@core/interfaces/common/workspace";

export function sumIfHaveValue(a?: number | null, b?: number | null) {
  if (a !== null && a !== undefined && b !== null && b !== undefined) return a + b;
  if (a !== null && a !== undefined) return a;
  if (b !== null && b !== undefined) return b;
  return null;
}

export function nullAcceptedWithSelectedPlan(scenarioId: string, plan: Plan, workspace: Workspace, dateColumn: string) {
  if (scenarioId === 'actual') {
    // For actual scenario, return null when the dateColumn is out of actual period
    if (new Date(dateColumn) > new Date(workspace.actualEndDate)) return null
    else return 0
  }

  if (scenarioId === 'current') {
    // For current scenario, return null when the dateColumn is out of current period
    if (new Date(dateColumn) < new Date(plan.currentPlanStartDate) || new Date(dateColumn) > new Date(plan.currentPlanEndDate)) return null
    else return 0
  }

  // For committed scenario, return 0 for all dateColumns
  if (scenarioId === 'committed'){
    return 0
  }

  // For displayedScenario, return null when the dateColumn is out of future period
  if (new Date(dateColumn) < new Date(plan.futurePlanStartDate)) return null
  else return 0
}
