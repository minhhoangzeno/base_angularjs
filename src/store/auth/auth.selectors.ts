import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState, AUTH_STATE_KEY } from './auth.state';

const selectFeature = createFeatureSelector<IAuthState>(AUTH_STATE_KEY);

export const select_loadingAuth = createSelector(selectFeature, (state) => state.loading);
export const select_authUser = createSelector(selectFeature, (state) => state.user);
export const select_authMessages = createSelector(selectFeature, (state) => state.messages);
export const select_authErrors = createSelector(selectFeature, (state) => state.errors);
