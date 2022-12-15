import { Component, OnDestroy } from '@angular/core';
import { interval, Subject, BehaviorSubject } from 'rxjs';

import { switchMap, takeUntil, map, tap } from 'rxjs/operators';
import { SimulationService } from '../../@core/backend/simcel/simulation.service';

const TEST_INTERVAL_MS = 2500;
const TEST_BULL_TASK_ID = 1;

@Component({
  selector: 'cel-e2e-scenario',
  templateUrl: './e2e-scenario.component.html',
})
export class E2eScenarioComponent implements OnDestroy {
  readonly destroyObs = new Subject<void>();

  /** Set task ID to observe here. */
  readonly taskIdObs = new BehaviorSubject(TEST_BULL_TASK_ID);

  /** Timestamp of last dataObs update */
  readonly lastUpdateObs = new BehaviorSubject<Date | undefined>(undefined);

  /** Observer that polls every 2.5s for state of observed task. */
  readonly dataObs = interval(TEST_INTERVAL_MS).pipe(
    takeUntil(this.destroyObs),
    switchMap(() => this.taskIdObs),
    switchMap((id) => this.simulationService.get(id)),
    map((state) => state || '<empty response>'),
    tap(() => this.lastUpdateObs.next(new Date())),
  );

  constructor(private readonly simulationService: SimulationService) {}

  ngOnDestroy() {
    this.destroyObs.next();
    this.destroyObs.complete();
  }

  createTask() {
    const config = {
      computeKpis: {
        quantityUnit: 'Carton',
      },
    };
    return this.simulationService
      .create({ masterInputDatabase: 'small_default', config })
      .subscribe((data) => this.taskIdObs.next(data.id));
  }
}
