import { createAction, props } from '@ngrx/store';
import { NbAuthToken } from '@nebular/auth';

import type { User } from '@/app/@core/interfaces/common/users';

export const DO_LOGIN = createAction(
  '[🔑 Login Page] Login',
  props<{ email: string; password: string }>(),
);
export const LOGIN_SUCCESS = createAction(
  '[🔑 Auth API] Login success',
  props<{ token: NbAuthToken; messages: string[]; redirect: string }>(),
);
export const LOGIN_FAILED = createAction(
  '[🔑 Auth API] Login failed',
  props<{ errors: string[] }>(),
);
export const GET_CURRENT_USER = createAction('[🔑 Auth API] Get current User');
export const GET_CURRENT_USER_SUCCESS = createAction(
  '[🔑 Auth API] Get current User success',
  props<{ data: User }>(),
);
export const GET_CURRENT_USER_FAILED = createAction(
  '[🔑 Auth API] Get current User failed',
  props<{ error: any }>(),
);
