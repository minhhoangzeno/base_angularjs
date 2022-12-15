import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  QueryParams,
} from '@ngrx/data';
import { HttpService } from '../backend/common/api/http.service';

import { Segment } from '../interfaces/business/segment';

@Injectable({ providedIn: 'root' })
export class SegmentService extends EntityCollectionServiceBase<Segment> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private readonly api: HttpService,
  ) {
    super('explorer/segments', serviceElementsFactory);
  }

  add(segment: Segment) {
    return super.add(segment);
  }

  getOptionsWithQuery(queryParams: QueryParams) {
    return this.api.get(`${this.entityName}/options`, { params: queryParams });
  }

  autocomplete(params: QueryParams) {
    return this.api.get(`${this.entityName}/autocomplete`, { params });
  }

  deleteSegment(segment:Segment){
    return super.delete(segment)
  }

  editSegment(segment:Segment){
    return super.update(segment)
  }  
  count(segment: Segment, planId: string) {
    const params = { segment, planId };
    return this.api.post(`${this.entityName}/count?planId=${planId}`, { segment });
  }
}
