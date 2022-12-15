import { TaskStatus, TaskStatusItem } from '@/app/@core/backend/simcel/task.service';
import { EventVersion } from '@/app/@core/interfaces/business/event';
import { Plan, PlanFlag } from '@/app/@core/interfaces/business/plan';
import {
  Scenario,
  ScenarioFlag,
  ScenarioWithTaskStatus,
} from '@/app/@core/interfaces/business/scenario';
import { ObjectRef, refId } from '@/app/@core/interfaces/common/mongo';
import { COLOR_CURRENT } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import {
  createPlaceholderScenarioFromWorkspace,
  PLACEHOLDER_ACTUAL_ID,
  PLACEHOLDER_COMMITTED_ID,
  PLACEHOLDER_CURRENT_ID,
} from '@/app/pages/explorer/shared/explorer.utils';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  select_editingScenario,
  select_highlightedScenarioId,
  select_scenarioEditEnabled,
} from '../pages/layout/layout.baseSelectors';
import { select_previousPlan, select_selectedPlan } from '../pages/layout/layout.selectors';
import { select_scenarioTaskStatuses } from '../task/task.selectors';
import { select_selectedWorkspace } from '../workspace/workspace.selectors';
import { select_plansetting } from '../plan-setting/planSetting.selectors'

import { IScenarioState, SCENARIO_STATE_KEY } from './scenario.state';

const selectFeature = createFeatureSelector<IScenarioState>(SCENARIO_STATE_KEY);

/** Initial scenario colors pool. */
export const INITIAL_SCENARIO_COLORS_POOL = ["#0048BA",
"#B0BF1A",
"#7CB9E8",
"#B284BE",
"#72A0C1",
"#EDEAE0",
"#DB2D43",
"#F0F8FF",
"#C46210",
"#EFDECD",
"#E52B50",
"#9F2B68",
"#F19CBB",
"#AB274F",
"#D3212D",
"#3B7A57",
"#FFBF00",
"#FF7E00",
"#9966CC",
"#3DDC84",
"#CD9575",
"#665D1E",
"#915C83",
"#841B2D",
"#FAEBD7",
"#008000",
"#8DB600",
"#FBCEB1",
"#00FFFF",
"#7FFFD4",
"#D0FF14",
"#4B5320",
"#8F9779",
"#E9D66B",
"#B2BEB5",
"#87A96B",
"#27346F",
"#FF9966",
"#A52A2A",
"#FDEE00",
"#568203",
"#007FFF",
"#F0FFFF",
"#89CFF0",
"#A1CAF1",
"#F4C2C2",
"#FEFEFA",
"#FF91AF",
"#FAE7B5",
"#DA1884",
"#7C0A02",
"#848482",
"#BCD4E6",
"#9F8170",
"#F5F5DC",
"#2E5894",
"#9C2542",
"#FFE4C4",
"#3D2B1F",
"#967117",
"#CAE00D",
"#BFFF00",
"#FE6F5E",
"#BF4F51",
"#000000",
"#3D0C02",
"#1B1811",
"#3B2F2F",
"#54626F",
"#3B3C36",
"#BFAFB2",
"#FFEBCD",
"#A57164",
"#318CE7",
"#ACE5EE",
"#FAF0BE",
"#660000",
"#0000FF",
"#1F75FE",
"#0093AF",
"#0087BD",
"#0018A8",
"#333399",
"#0247FE",
"#A2A2D0",
"#6699CC",
"#0D98BA",
"#064E40",
"#5DADEC",
"#126180",
"#8A2BE2",
"#7366BD",
"#4D1A7F",
"#5072A7",
"#3C69E7",
"#DE5D83",
"#79443B",
"#E3DAC9",
"#006A4E",
"#87413F",
"#CB4154",
"#66FF00",
"#D891EF",
"#C32148",
"#1974D2",
"#FFAA1D",
"#FF55A3",
"#FB607F",
"#004225",
"#CD7F32",
"#88540B",
"#AF6E4D",
"#1B4D3E",
"#7BB661",
"#FFC680",
"#800020",
"#DEB887",
"#A17A74",
"#CC5500",
"#E97451",
"#8A3324",
"#BD33A4",
"#702963",
"#536872",
"#5F9EA0",
"#A9B2C3",
"#91A3B0",
"#006B3C",
"#ED872D",
"#E30022",
"#FFF600",
"#A67B5B",
"#4B3621",
"#A3C1AD",
"#C19A6B",
"#EFBBCC",
"#FFFF99",
"#FFEF00",
"#FF0800",
"#E4717A",
"#00BFFF",
"#592720",
"#C41E3A",
"#00CC99",
"#960018",
"#D70040",
"#FFA6C9",
"#B31B1B",
"#56A0D3",
"#ED9121",
"#00563F",
"#703642",
"#C95A49",
"#ACE1AF",
"#007BA7",
"#2F847C",
"#B2FFFF",
"#246BCE",
"#DE3163",
"#007BA7",
"#2A52BE",
"#6D9BC3",
"#1DACD6",
"#007AA5",
"#E03C31",
"#F7E7CE",
"#F1DDCF",
"#36454F",
"#232B2B",
"#E68FAC",
"#DFFF00",
"#7FFF00",
"#FFB7C5",
"#954535",
"#E23D28",
"#DE6FA1",
"#A8516E",
"#AA381E",
"#856088",
"#FFB200",
"#7B3F00",
"#D2691E",
"#58111A",
"#FFA700",
"#98817B",
"#E34234",
"#CD607E",
"#E4D00A",
"#9FA91F",
"#7F1734",
"#0047AB",
"#D2691E",
"#6F4E37",
"#B9D9EB",
"#F88379",
"#8C92AC",
"#B87333",
"#DA8A67",
"#AD6F69",
"#CB6D51",
"#996666",
"#FF3800",
"#FF7F50",
"#F88379",
"#893F45",
"#FBEC5D",
"#B31B1B",
"#6495ED",
"#FFF8DC",
"#2E2D88",
"#FFF8E7",
"#81613C",
"#FFBCD9",
"#FFFDD0",
"#DC143C",
"#9E1B32",
"#A7D8DE",
"#F5F5F5",
"#00FFFF",
"#00B7EB",
"#58427C",
"#FFD300",
"#F56FA1",
"#666699",
"#654321",
"#5D3954",
"#26428B",
"#008B8B",
"#536878",
"#B8860B",
"#013220",
"#006400",
"#1A2421",
"#BDB76B",
"#483C32",
"#534B4F",
"#543D37",
"#8B008B",
"#4A5D23",
"#556B2F",
"#FF8C00",
"#9932CC",
"#03C03C",
"#301934",
"#8B0000",
"#E9967A",
"#8FBC8F",
"#3C1414",
"#8CBED6",
"#483D8B",
"#2F4F4F",
"#177245",
"#00CED1",
"#9400D3",
"#00703C",
"#555555",
"#DA3287",
"#FAD6A5",
"#B94E48",
"#004B49",
"#FF1493",
"#FF9933",
"#00BFFF",
"#4A646C",
"#7E5E60",
"#1560BD",
"#2243B6",
"#C19A6B",
"#EDC9AF",
"#696969",
"#1E90FF",
"#D71868",
"#967117",
"#00009C",
"#EFDFBB",
"#E1A95F",
"#555D50",
"#C2B280",
"#1B1B1B",
"#614051",
"#F0EAD6",
"#1034A6",
"#16161D",
"#7DF9FF",
"#00FF00",
"#6F00FF",
"#CCFF00",
"#BF00FF",
"#8F00FF",
"#50C878",
"#6C3082",
"#1B4D3E",
"#B48395",
"#AB4B52",
"#CC474B",
"#563C5C",
"#00FF40",
"#96C8A2",
"#C19A6B",
"#801818",
"#B53389",
"#DE5285",
"#F400A1",
"#E5AA70",
"#9FD170",
"#4D5D53",
"#4F7942",
"#6C541E",
"#FF5470",
"#683068",
"#B22222",
"#CE2029",
"#E95C4B",
"#E25822",
"#EEDC82",
"#A2006D",
"#FFFAF0",
"#15F4EE",
"#5FA777",
"#014421",
"#228B22",
"#A67B5B",
"#856D4D",
"#0072BB",
"#FD3F92",
"#86608E",
"#9EFD38",
"#D473D4",
"#FD6C9E",
"#C72C48",
"#F64A8A",
"#77B5FE",
"#8806CE",
"#E936A7",
"#FF00FF",
"#C154C1",
"#CC397B",
"#C74375",
"#E48400",
"#87421F"]

/**=================[Mapper]=================*/
// function scenarioWithColorMapper(scenario: Scenario, index: number): Scenario {
//   return { ...scenario, color: scenario.color ? scenario.color : '#0C80EB' };
// }
const scenarioWithTaskStatus =
  (taskStatuses: readonly TaskStatusItem[]) =>
    (s: Scenario): ScenarioWithTaskStatus => {
      const statuses = (s.tasks || [])
        .map((t) => taskStatuses.find((a) => t === a?.id))
        .filter(notNullOrUndefined);

      return {
        ...s,
        tasksSummary: statuses.length
          ? {
            status: statuses.some((s) => s.status === TaskStatus.Failed)
              ? TaskStatus.Failed
              : statuses.some((s) => s.status === TaskStatus.InProgress)
                ? TaskStatus.InProgress
                : statuses.every((s) => s.status === TaskStatus.Finished)
                  ? TaskStatus.Finished
                  : TaskStatus.Unknown,
            error: statuses.map((s) => s.error).join('\n'),
          }
          : { status: TaskStatus.Unknown },
      };
    };
const scenarioWithPrimaryStatus =
  (plan?: Plan) =>
    (scenario: Scenario): Scenario => ({
      ...scenario,
      isPrimary: scenario.id === refId(plan?.primaryScenario),
    });

/**=================[Selectors]=================*/

// Base selector, only for private use
export const select_scenarios = createSelector(selectFeature, (state) => [...state.data]);

export const select_actualScenario = createSelector(select_selectedWorkspace, (workspace) =>
  workspace ? createPlaceholderScenarioFromWorkspace(workspace) : undefined,
);
export const select_committedScenario = createSelector(
  select_selectedPlan,
  select_selectedWorkspace,
  selectFeature,
  (selectedPlan, workspace, state) => {
    const primaryEvents: ObjectRef<EventVersion>[] = [];

    for (const scenario of state.primaryScenarios) {
      for (const event of scenario.events || []) {
        if (primaryEvents.every((e) => refId(event) !== refId(e))) {
          primaryEvents.push(event);
        }
      }
    }

    return selectedPlan
      ? createPlaceholderScenarioFromWorkspace(workspace, {
        id: 'committed',
        name: 'Committed Plans',
        flags: [ScenarioFlag.COMMITTED],
        color: COLOR_CURRENT,
        events: primaryEvents,
      })
      : undefined;
  },
);
export const select_currentScenario = createSelector(select_selectedWorkspace, (workspace) =>
  workspace
    ? createPlaceholderScenarioFromWorkspace(workspace, {
      id: PLACEHOLDER_CURRENT_ID,
      name: 'Current',
      flags: [ScenarioFlag.CURRENT],
      color: COLOR_CURRENT,
    })
    : undefined,
);
export const select_legacy_actualAndCommittedScenarios = createSelector(
  selectFeature,
  (s) => s.legacy_actualAndCommittedScenarios,
);

/**
 * Select Scenarios to display
 *
 * Including "Actual", "Committed" and "Blank" (creating new scenario)
 */
export const select_displayingScenarioIds = createSelector(
  select_selectedPlan,
  select_editingScenario,
  select_plansetting,
  (selectedPlan, editingScenario, planSetting): string[] => {
    if (!selectedPlan) return [];
    if (selectedPlan.flags?.includes(PlanFlag.ACTUAL))
      return [PLACEHOLDER_ACTUAL_ID, PLACEHOLDER_COMMITTED_ID];

    return (planSetting?.displayedScenarios || [])
      .map(refId)
      .filter(notNullOrUndefined)
      .concat(...(editingScenario?.blankScenario ? [editingScenario.id] : [])); // Add editing Scenario if it new (blank)
  },
);

/**
 * Select Scenarios to display
 *
 * Including "Actual", "Committed" and "Blank" (creating new scenario)
 */
export const select_displayingScenarios = createSelector(
  select_scenarios,
  select_selectedPlan,
  select_actualScenario,
  select_committedScenario,
  select_editingScenario,
  select_plansetting,
  (scenarios, selectedPlan, actualScenario, committedScenario, editingScenario, planSetting,): Scenario[] => {
    if (!selectedPlan) return [];
    if (selectedPlan.flags?.includes(PlanFlag.ACTUAL))
      return [actualScenario, committedScenario].filter(notNullOrUndefined);

    return (planSetting?.displayedScenarios || [])
      .map(refId)
      .map((id) => scenarios.find((s) => s.id === id))
      .filter(notNullOrUndefined)
      .concat(...(editingScenario?.blankScenario ? [editingScenario] : [])) // Add editing Scenario if it new (blank)
      // .map(scenarioWithColorMapper)
      .map(scenarioWithPrimaryStatus(selectedPlan));
  },
);

export const select_displayingScenariosWithTaskStatus = createSelector(
  select_displayingScenarios,
  select_scenarioTaskStatuses,
  (displayingScenarios, scenarioTaskStatuses): ScenarioWithTaskStatus[] =>
    displayingScenarios.map(scenarioWithTaskStatus(scenarioTaskStatuses)),
);


export const select_Scenarios = createSelector(
  select_displayingScenarios,
  select_scenarioTaskStatuses,
  (displayingScenarios, scenarioTaskStatuses): ScenarioWithTaskStatus[] =>
    displayingScenarios.map(scenarioWithTaskStatus(scenarioTaskStatuses)),
);

export const select_unselectedScenarios = createSelector(
  select_scenarios,
  select_selectedPlan,
  select_plansetting,
  (scenarios, selectedPlan, planSetting) =>
    !selectedPlan
      ? []
      : scenarios.filter(
        (scenario) =>
          !planSetting?.displayedScenarios?.map(refId)?.some((id) => id === scenario.id),
      ),
);
export const select_primaryScenario = createSelector(
  select_selectedPlan,
  select_displayingScenarios,
  (selectedPlan, displayingScenarios): Scenario | undefined =>
    displayingScenarios.find((s) => s.id === refId(selectedPlan?.primaryScenario)) || undefined,
);

export const select_highlightedScenario = createSelector(
  select_scenarioEditEnabled,
  select_editingScenario,
  select_displayingScenarios,
  select_highlightedScenarioId,
  (
    scenarioEditEnabled,
    editingScenario,
    displayingScenarios,
    highlightedSceanrioId,
  ): Scenario | undefined =>
    (scenarioEditEnabled && editingScenario) ||
    displayingScenarios.find((s) => s.id === highlightedSceanrioId) ||
    displayingScenarios[0] ||
    undefined,
);

export const select_selectedForecastBaseScenario = createSelector(
  select_scenarios,
  select_selectedPlan,
  (scenarios, selectedPlan) => ({
    forecastBaseScenario: scenarios.find((s) => s.flags?.includes(ScenarioFlag.FORECAST_BASE)),
    selectedPlan,
  }),
);

export const select_previousPrimaryScenario = createSelector(
  select_previousPlan,
  selectFeature,
  (previousPlan, state) => {
    return !previousPlan
      ? null
      : state.primaryScenarios.find((s) => s.id === refId(previousPlan.primaryScenario)) || null;
  },
);
