import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, from } from 'rxjs';
import { map, exhaustMap, catchError, switchMap, filter } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NB_AUTH_OPTIONS, NbAuthService } from '@nebular/auth';

import { UserData } from '@/app/@core/interfaces/common/users';
import { UserStore } from '@/app/@core/stores/user.store';
import * as AuthActions from './auth.actions';
import { DO_LOGOUT } from '../pages/layout/layout.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.DO_LOGIN),
      exhaustMap((action) =>
        this.service.authenticate(this.options.forms.login.strategy, action).pipe(
          map((result) => {
            if (!result.isSuccess())
              return AuthActions.LOGIN_FAILED({ errors: result.getErrors() });

            const token = result.getToken();
            const redirect = result.getRedirect();
            const messages = result.getMessages();
            return AuthActions.LOGIN_SUCCESS({ token, redirect, messages });
          }),
          catchError((error) => of(AuthActions.LOGIN_FAILED(error))),
        ),
      ),
    );
  });

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DO_LOGOUT),
        switchMap(() =>
          this.service
            .logout(this.options.forms.login.strategy)
            .pipe(switchMap(() => this.router.navigateByUrl('auth/login'))),
        ),
      );
    },
    { dispatch: false },
  );

  getCurrenntUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.GET_CURRENT_USER),
      switchMap(() =>
        this.userService.getCurrentUser().pipe(
          map((user) => {
            // TODO: migrate userStore to this AuthStore
            this.userStore.setUser(user);
            return AuthActions.GET_CURRENT_USER_SUCCESS({ data: user });
          }),
          catchError((error) => of(AuthActions.GET_CURRENT_USER_FAILED({ error }))),
        ),
      ),
    );
  });

  // When login success, auto redirect to dashboard
  redirectWhenLoginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGIN_SUCCESS),
        filter(({ redirect }) => !!redirect),
        switchMap(({ redirect }) => from(this.router.navigateByUrl(redirect))),
      );
    },
    { dispatch: false },
  );

  // When fail to load current user, force logout
  logoutWhenFailToGetCurrentUser$ = createEffect(
    () => {
      return this.actions$.pipe(ofType(AuthActions.GET_CURRENT_USER_FAILED), map(DO_LOGOUT));
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: NbAuthService,
    private readonly userService: UserData,
    private readonly router: Router,
    private readonly userStore: UserStore,
    @Inject(NB_AUTH_OPTIONS) private readonly options: any,
  ) {}
}
