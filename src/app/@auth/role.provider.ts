/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { NbAuthService, NbAuthOAuth2JWTToken, NbAuthToken } from '@nebular/auth';
import { NbRoleProvider } from '@nebular/security';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class RoleProvider extends NbRoleProvider {
  constructor(private readonly authService: NbAuthService) {
    super();
  }

  getLowerCaseRoles(roles: any): string | string[] {
    if (Array.isArray(roles)) {
      roles = roles.map((element) => {
        return element.toLowerCase();
      });
    } else {
      roles = roles.toLowerCase();
    }
    return roles;
  }

  getRole(): Observable<string | string[]> {
    const ensureTokenType = (token: NbAuthToken): token is NbAuthOAuth2JWTToken => {
      return token instanceof NbAuthOAuth2JWTToken;
    };

    return this.authService.getToken().pipe(
      filter(ensureTokenType),
      map((token) => {
        const payload = token.getAccessTokenPayload();
        return token.isValid() && payload && payload['role']
          ? this.getLowerCaseRoles(payload['role'])
          : 'guest';
      }),
    );
  }
}
