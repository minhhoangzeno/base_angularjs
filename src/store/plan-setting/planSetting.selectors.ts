import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IPlanSettingState, PLAN_SETTING_STATE_KEY } from './planSetting.state'

const selectFeature = createFeatureSelector<IPlanSettingState>(PLAN_SETTING_STATE_KEY);

export const select_plansetting = createSelector(selectFeature, (state) => state.planSetting);