import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EventVersion } from '../../interfaces/business/event';
import { HttpService } from '../common/api/http.service';

/** Simplified service for triggering and monitoring pricing generator runs. */
@Injectable()
export class PricingGenerationService {
  private readonly apiController: string = 'simcel-async/pricing-generation';

  constructor(private readonly api: HttpService) {}

  createPricingForEventVersion(eventVersion: EventVersion, planId: string): Observable<any> {
    const url = `${this.apiController}/`;
    // See GeneratePricingImpactRequest in backend for format of payload.
    // TODO(nathaniel): Centralize all constants.
    const data = {
      eventVersions: [eventVersion],
      planId,
    };
    return this.api.post(url, data);
  }
}
