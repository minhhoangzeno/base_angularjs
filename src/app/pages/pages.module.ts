import { NgModule } from '@angular/core';
import { NbMenuModule, NbCardModule } from '@nebular/theme';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { ThemeModule } from '../@theme/theme.module';
import { AuthModule } from '../@auth/auth.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesMenu } from './pages-menu';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ExplorerModule } from './explorer/explorer.module';
import { E2eScenarioModule } from './e2e-scenario/e2e-scenario.module';
import { PlanManagementModule } from './plan-management/plan-management.module';
import { planReducer, PLAN_STATE_KEY } from '@/store/plan/plan.state';
import { workspaceReducer, WORKSPACE_STATE_KEY } from '@/store/workspace/workspace.state';
import { scenarioReducer, SCENARIO_STATE_KEY } from '@/store/scenario/scenario.state';
import { ScenarioEffects } from '@/store/scenario/scenario.effects';
import { PlanSettingEffects } from '@/store/plan-setting/planSetting.effects';
import { PlanEffects } from '@/store/plan/plan.effects';
import { segmentReducer, SEGMENT_STATE_KEY } from '@/store/segment/segment.state';
import { SegmentEffects } from '@/store/segment/segment.effects';
import { eventReducer, EVENT_STATE_KEY } from '@/store/event/event.state';
import { widgetReducer, WIDGET_STATE_KEY } from '@/store/widget/widget.state';
import { EventEffects } from '@/store/event/event.effects';
import { taskReducer, TASK_STATE_KEY } from '@/store/task/task.state';
import { TaskEffects } from '@/store/task/task.effects';
import {
  page_demandPLanningReducer,
  PAGE__DEMAND_PLANNING_STATE_KEY,
} from '@/store/pages/demand-planning/demand-planning.state';
import {
  page_eventsManagementReducer,
  PAGE__EVENTS_MANAGEMENT_STATE_KEY,
} from '@/store/pages/event-management/event-management.state';
import { planImportReducer, PLAN_IMPORT_STATE_KEY } from '@/store/plan-import/plan-import.state';
import { PlanImportEffects } from '@/store/plan-import/plan-import.effects';
import { LayoutEffects } from '@/store/pages/layout/layout.effects';
import { page_layoutReducer, PAGE__LAYOUT_STATE_KEY } from '@/store/pages/layout/layout.state';
import { DemandPlanningPageEffects } from '@/store/pages/demand-planning/demand-planning.effects';
import { BizPageEffects } from '@/store/pages/planning-explorer/planning-explorer.effects';
import {
  page_bizReducer,
  PAGE__BIZ_STATE_KEY,
} from '@/store/pages/planning-explorer/planning-explorer.state';
import {
  page_inputDataReducer,
  PAGE__INPUT_DATA_STATE_KEY,
} from '@/store/pages/input-data/input-data.state';
import { InputDataEffects } from '@/store/pages/input-data/input-data.effects';
import { planSettingReducer, PLAN_SETTING_STATE_KEY } from '@/store/plan-setting/planSetting.state';

const NZ_MODULES = [NzDatePickerModule];
const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    MiscellaneousModule,
    ExplorerModule,
    E2eScenarioModule,
    PlanManagementModule,
    ...NZ_MODULES,
    AuthModule.forRoot(),
    StoreModule.forFeature(EVENT_STATE_KEY, eventReducer),
    StoreModule.forFeature(PLAN_STATE_KEY, planReducer),
    StoreModule.forFeature(SCENARIO_STATE_KEY, scenarioReducer),
    StoreModule.forFeature(PLAN_SETTING_STATE_KEY, planSettingReducer),
    StoreModule.forFeature(SEGMENT_STATE_KEY, segmentReducer),
    StoreModule.forFeature(TASK_STATE_KEY, taskReducer),
    StoreModule.forFeature(WIDGET_STATE_KEY, widgetReducer),
    StoreModule.forFeature(WORKSPACE_STATE_KEY, workspaceReducer),
    StoreModule.forFeature(PLAN_IMPORT_STATE_KEY, planImportReducer),
    StoreModule.forFeature(PAGE__LAYOUT_STATE_KEY, page_layoutReducer),
    StoreModule.forFeature(PAGE__BIZ_STATE_KEY, page_bizReducer),
    StoreModule.forFeature(PAGE__DEMAND_PLANNING_STATE_KEY, page_demandPLanningReducer),
    StoreModule.forFeature(PAGE__EVENTS_MANAGEMENT_STATE_KEY, page_eventsManagementReducer),
    StoreModule.forFeature(PAGE__INPUT_DATA_STATE_KEY, page_inputDataReducer),
    EffectsModule.forFeature([
      EventEffects,
      PlanEffects,
      ScenarioEffects,
      PlanSettingEffects,
      SegmentEffects,
      TaskEffects,
      PlanImportEffects,
      LayoutEffects,
      DemandPlanningPageEffects,
      BizPageEffects,
      InputDataEffects,
    ]),
  ],
  declarations: [...PAGES_COMPONENTS],
  providers: [PagesMenu],
})
export class PagesModule { }
