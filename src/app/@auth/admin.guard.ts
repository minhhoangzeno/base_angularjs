/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { map } from 'rxjs/operators';
import { NbRoleProvider } from '@nebular/security';
import { ROLES } from './roles';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly roleProvider: NbRoleProvider) {}

  canActivate() {
    return this.roleProvider.getRole().pipe(
      map((role) => {
        const roles = role instanceof Array ? role : [role];
        return roles.some((x) => x && x.toLowerCase() === ROLES.ADMIN);
      }),
    );
  }
}
