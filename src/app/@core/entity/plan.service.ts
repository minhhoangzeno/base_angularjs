import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { lastValueFrom } from 'rxjs';

import { Plan } from '../interfaces/business/plan';
import { Scenario, ScenarioFlag } from '../interfaces/business/scenario';
import { refId } from '../interfaces/common/mongo';
import { ScenarioService } from './scenario.service';

/**
 * We are using ngrx immutable data store. 
 * https://github.com/ngrx/platform/blob/master/modules/store/src/meta-reducers/immutability_reducer.ts
 * When the plan object is update, it triggers the immutable reducers, 
 * which attempt to freeze the object. 
 * However, there are objects that cannot be frozen. 
 * Attempt to do so throws errors and crashes relevant observable tree.
 * 
 * Find the object that cannot be frozen.
 * ```js
 *   const freeze = Object.freeze.bind(Object);
 *   (Object as any).freeze = (obj) => {
 *    try { freeze(obj); } catch (e) { console.log(obj); console.log(e); }
 *    return obj;
 *   }
 * ```
 * 
 * The result is window object. Where does it come from?
 * The tasksStatusSummary when subscribed by Angular Ivy renderer.
 * `plan?.tasksStatusSummary | async as statusSummary`
 * Additional problem arises when tasksStatusSummary, a circular object, 
 * must be serialized to be sent over HTTP.
 * The fix is to keep the complex circular object 
 * out of ngrx store and HTTP api calls.

 */

@Injectable({ providedIn: 'root' })
export class PlanService extends EntityCollectionServiceBase<Plan> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private readonly scenariosService: ScenarioService,
  ) {
    super('explorer/plans', serviceElementsFactory);
  }

  async updatePrimaryScenario(plan: Plan, nextPrimaryScenario: Scenario) {
    if (refId(plan.primaryScenario) === nextPrimaryScenario.id) return plan;

    let prevPrimaryScenario = await lastValueFrom(
      this.scenariosService.getByKey(plan.primaryScenario),
    );

    prevPrimaryScenario = {
      ...prevPrimaryScenario,
      flags: prevPrimaryScenario.flags?.filter((flag) => flag !== ScenarioFlag.PRIMARY),
    };

    await lastValueFrom(this.scenariosService.update(prevPrimaryScenario));

    const updatedPlan = await lastValueFrom(
      this.update({
        ...plan,
        primaryScenario: nextPrimaryScenario.id,
      }),
    );

    await lastValueFrom(
      this.scenariosService.update({
        ...nextPrimaryScenario,
        flags: [...(nextPrimaryScenario.flags || []), ScenarioFlag.PRIMARY],
      }),
    );

    return updatedPlan;
  }
}
