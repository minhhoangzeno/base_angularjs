import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '@/app/@core/backend/common/api/http.service';
import {
  ILoadEditedMasterIputDataParams,
  ILoadMasterIputDataParams,
  IUpsertMasterIputDataParams,
} from '@/store/pages/input-data/input-data.actions';

const ENDPOINT = 'explorer/mdata/';

@Injectable()
export class InputDataService {
  constructor(private readonly http: HttpService) {}

  load({ collection, ...rest }: ILoadMasterIputDataParams): Observable<ReadonlyArray<any>> {
    return this.http.get(ENDPOINT + collection, { params: { ...rest } });
  }
  loadTotal({ collection, ...rest }: ILoadMasterIputDataParams): Observable<number> {
    return this.http.get(ENDPOINT + 'total/' + collection, { params: { ...rest } });
  }
  loadEditied({
    collection,
    database,
    scenarioId,
  }: ILoadEditedMasterIputDataParams): Observable<ReadonlyArray<any>> {
    return this.http.get(ENDPOINT + collection, {
      params: {
        database,
        scope: scenarioId,
      },
    });
  }

  upsert({ collection, database, scenarioId, row }: IUpsertMasterIputDataParams) {
    return this.http.post(ENDPOINT + collection, row, {
      params: {
        database,
        scope: scenarioId,
      },
    });
  }
}
