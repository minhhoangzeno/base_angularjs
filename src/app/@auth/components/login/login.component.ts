/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink, NbAuthService } from '@nebular/auth';
import { NbThemeService } from '@nebular/theme';
import { Store } from '@ngrx/store';

import { EMAIL_PATTERN } from '../constants';
import { getDeepFromObject } from '../../helpers';
import * as AuthActions from '@/store/auth/auth.actions';
import {
  select_authErrors,
  select_authMessages,
  select_authUser,
  select_loadingAuth,
} from '@/store/auth/auth.selectors';

@Component({
  selector: 'cel-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class NgxLoginComponent implements OnInit {
  minLength: number = this.getConfigValue('forms.validation.password.minLength');
  maxLength: number = this.getConfigValue('forms.validation.password.maxLength');
  redirectDelay: number = this.getConfigValue('forms.login.redirectDelay');
  showMessages: any = this.getConfigValue('forms.login.showMessages');
  strategy: string = this.getConfigValue('forms.login.strategy');
  socialLinks: NbAuthSocialLink[] = this.getConfigValue('forms.login.socialLinks');
  rememberMe = this.getConfigValue('forms.login.rememberMe');
  isEmailRequired: boolean = this.getConfigValue('forms.validation.email.required');
  isPasswordRequired: boolean = this.getConfigValue('forms.validation.password.required');

  errors = this.store.select(select_authErrors);
  messages = this.store.select(select_authMessages);
  user = this.store.select(select_authUser);
  submitted = this.store.select(select_loadingAuth);
  loginForm!: FormGroup;
  alive = true;

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected themeService: NbThemeService,
    private readonly fb: FormBuilder,
    protected router: Router,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    const emailValidators = [Validators.pattern(EMAIL_PATTERN)];
    this.isEmailRequired && emailValidators.push(Validators.required);

    const passwordValidators = [
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ];
    this.isPasswordRequired && passwordValidators.push(Validators.required);

    this.loginForm = this.fb.group({
      email: this.fb.control('', [...emailValidators]),
      password: this.fb.control('', [...passwordValidators]),
      rememberMe: this.fb.control(false),
    });
  }

  login() {
    this.store.dispatch(AuthActions.DO_LOGIN(this.loginForm.value));
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
