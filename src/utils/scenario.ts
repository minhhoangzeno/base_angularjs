import { Plan } from '@/app/@core/interfaces/business/plan';
import { Scenario } from '@/app/@core/interfaces/business/scenario';

export function generateBlankScenario(plan: Plan): Scenario {
  return {
    blankScenario: true,
    id: 'blank_' + Date.now(),
    name: 'New Scenario',
    planRef: plan.id,
    flags: [],
    inputDatabase: plan.masterInputDatabase,
    events: [],
  };
}
export function generateClonedScenario(scenario: Scenario): Scenario {
  return {
    id: 'cloned_' + Date.now(),
    name: `${scenario.name} [cloned]`,
    planRef: scenario.planRef,
    flags: [...(scenario.flags || [])],
    events: [...(scenario.events || [])],
    inputDatabase: scenario.inputDatabase,
  };
}
export function isBlankScenario(scenario: Scenario) {
  return !scenario.id || scenario.id.startsWith('blank_') || scenario.id.startsWith('cloned_');
}
