/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
import { ServerDataSource } from 'ng2-smart-table';

import { environment } from '@/environments/environment';

@Injectable()
export class HttpService {
  get apiUrl(): string {
    return environment.apiUrl;
  }

  constructor(private readonly http: HttpClient) {}

  getServerDataSource(uri: string): DataSource {
    return new ServerDataSource(this.http, {
      endPoint: uri,
      totalKey: 'totalCount',
      dataKey: 'items',
      pagerPageKey: 'pageNumber',
      pagerLimitKey: 'pageSize',
      filterFieldKey: 'filterBy#field#',
      sortFieldKey: 'sortBy',
      sortDirKey: 'orderBy',
    });
  }

  get(endpoint: string, options?: Parameters<HttpClient['get']>[1]): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`, options);
  }

  post(
    endpoint: string,
    data: Parameters<HttpClient['post']>[1],
    options?: Parameters<HttpClient['post']>[2],
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data, options);
  }

  put(
    endpoint: string,
    data: Parameters<HttpClient['put']>[1],
    options?: Parameters<HttpClient['put']>[2],
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data, options);
  }

  delete(endpoint: string, options?: Parameters<HttpClient['delete']>[1]): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}`, options);
  }
}
