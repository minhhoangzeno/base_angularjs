import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Simulation } from '../../interfaces/simulation/simulation';
import { HttpService } from '../common/api/http.service';

/** Simplified service for triggering and monitoring end-to-end runs. */
@Injectable()
export class SimulationService {
  private readonly apiController: string = 'simcel-async/e2e';

  constructor(private readonly api: HttpService) {}

  get(id: number): Observable<Simulation> {
    return this.api.get(`${this.apiController}/${id}`);
  }

  create(body: Record<string, unknown>): Observable<Simulation> {
    return this.api.post(this.apiController, body);
  }
}
