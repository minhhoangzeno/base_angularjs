/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UsersApi } from '../api/users.api';
import { UserData, User } from '../../../interfaces/common/users';
import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
import { NbAuthService } from '@nebular/auth';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class UsersService extends UserData {
  constructor(private readonly api: UsersApi, private readonly authService: NbAuthService) {
    super();
  }

  get gridDataSource(): DataSource {
    return this.api.usersDataSource;
  }

  list(pageNumber = 1, pageSize = 10): Observable<User[]> {
    return this.api.list(pageNumber, pageSize);
  }

  getCurrentUser(): Observable<User> {
    return this.authService.isAuthenticated().pipe(
      switchMap((authenticated) => (authenticated ? this.api.getCurrent() : of(null))),
      map((u) => {
        if (u && !u.setting) {
          u.setting = {};
        }
        return u;
      }),
    );
  }

  get(id: string): Observable<User> {
    return this.api.get(id);
  }

  create(user: any): Observable<User> {
    return this.api.add(user);
  }

  update(user: any): Observable<User> {
    return this.api.update(user);
  }

  updateCurrent(user: any): Observable<User> {
    return this.api.updateCurrent(user);
  }

  delete(id: string): Observable<boolean> {
    return this.api.delete(id);
  }
}
