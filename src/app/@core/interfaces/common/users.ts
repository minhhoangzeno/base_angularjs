/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Observable } from 'rxjs';
import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
import { Settings } from './settings';
import { Workspace } from './workspace';

export interface User {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  name?: string;
  age: number;
  login: string;
  picture: string;
  address: Address;
  settings: Settings;
  workspaces?: Workspace[];
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export abstract class UserData {
  abstract get gridDataSource(): DataSource;
  abstract getCurrentUser(): Observable<User>;
  abstract list(pageNumber: number, pageSize: number): Observable<User[]>;
  abstract get(id: string): Observable<User>;
  abstract update(user: User): Observable<User>;
  abstract updateCurrent(user: User): Observable<User>;
  abstract create(user: User): Observable<User>;
  abstract delete(id: string): Observable<boolean>;
}
