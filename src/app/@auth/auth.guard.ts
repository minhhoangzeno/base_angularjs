/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { CanActivate, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: NbAuthService, private readonly router: Router) {}

  async canActivate() {
    const authenticated = await lastValueFrom(this.authService.isAuthenticated());
    if (!authenticated) {
      await this.router.navigate(['auth', 'login']);
    }
    return authenticated;
  }
}
