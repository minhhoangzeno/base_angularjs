import { createReducer, on } from '@ngrx/store';

import { User } from '@/app/@core/interfaces/common/users';
import * as AuthActions from './auth.actions';
import { DO_LOGOUT } from '../pages/layout/layout.actions';

export const AUTH_STATE_KEY = 'auth';

/*************************************
 * State
 *************************************/

export interface IAuthState {
  user?: User;
  loading: boolean;
  errors: string[];
  messages: string[];
}

export const initialState: IAuthState = {
  loading: false,
  errors: [],
  messages: [],
};

/*************************************
 * Reducers
 *************************************/

export const authReducer = createReducer(
  initialState,
  on(AuthActions.DO_LOGIN, (state): IAuthState => ({ ...state, loading: true })),
  on(
    AuthActions.LOGIN_FAILED,
    (state, { errors }): IAuthState => ({ ...state, loading: false, errors }),
  ),
  on(
    AuthActions.LOGIN_SUCCESS,
    (state, { messages }): IAuthState => ({
      ...state,
      loading: false,
      errors: [],
      messages,
    }),
  ),
  on(
    AuthActions.GET_CURRENT_USER_SUCCESS,
    (state, { data: user }): IAuthState => ({ ...state, user }),
  ),
  on(DO_LOGOUT, (): IAuthState => ({ ...initialState })),
);
