import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { Event, EventType, EventVersion } from '../interfaces/business/event';
import { Plan } from '../interfaces/business/plan';
import { EventService } from './event.service';
import { PlanService } from './plan.service';
import { ScenarioService } from './scenario.service';
import { q } from '@/utils/request';
import { EditEventVersionWarningDialog } from '@/app/@components/common/edit-event-version-warning-dialog/edit-event-version-warning-dialog.components';
import { NbDialogService } from '@nebular/theme';
import { Scenario } from '../interfaces/business/scenario';
import { SimulationService } from '../backend/simcel/simulation.service';
import { DemandService, IGetDemandImpactsChartDataParams } from './demand.service';
import { refId } from '../interfaces/common/mongo';

@Injectable({ providedIn: 'root' })
export class EventVersionService extends EntityCollectionServiceBase<EventVersion> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private readonly eventService: EventService,
    private readonly scenarioService: ScenarioService,
    private readonly planService: PlanService,
    private readonly dialogService: NbDialogService,
    private readonly simulationSerivce: SimulationService,
    private readonly demandService: DemandService,
  ) {
    super('explorer/event-versions', serviceElementsFactory);
  }

  async addOrUpdateEventVersion(version: EventVersion, event: Event, params: IGetDemandImpactsChartDataParams) {
    // The service.upsert doesn't quite fit with nestjsx CRUD, so we fall back to manual
    // checking if id exists before deciding update or add.
    // TODO(nathaniel): Might want to convert this into a utility function.

    let confirmed: boolean = false
    let editEventVersion: boolean = false
    let rerunScenario: Scenario[] = []
    if (version.id) {
      const scenarios = await lastValueFrom(
        this.scenarioService.getWithQuery(
          { workspace: params.workspaceId },
        ),
      );

      rerunScenario = scenarios.filter((s) => {
        return s.events?.map(refId).some((e) => (e === version.id))
      })

      if (rerunScenario.length == 0) {
        confirmed = true
      } else {

        let planIds: string[] = [];

        rerunScenario.map((scenario) => {
          if (!planIds.includes(scenario.planRef)) {
            planIds.push(scenario.planRef);
          }
        });

        let plans: Plan[] = [];

        for (const planId of planIds) {
          const plan = await lastValueFrom(this.planService.getByKey(planId));

          plans.push(plan);
        }

        confirmed = await lastValueFrom(
          this.dialogService.open(EditEventVersionWarningDialog, {
            context: {
              scenarios: rerunScenario,
              plans: plans,
            },
          }).onClose,
        );

        if (!confirmed) {
          editEventVersion = true
          const unchangedVersion = await lastValueFrom(this.getByKey(version.id))
          return { version: unchangedVersion, event, confirmed, editEventVersion };
        }
      }
    }

    if (version.id && confirmed) {
      editEventVersion = true
      await lastValueFrom(this.update(version));
    } else {
      version = await lastValueFrom(this.add(version));
    }

    // If has no associated event for this version, then let's create one.
    if (event.id && confirmed) {
      await lastValueFrom(this.eventService.update(event));
    } else {
      event = await lastValueFrom(
        this.eventService.add(createDummyEvent(event.name, event.type)),
      );
    }

    // Update the parent event if version does not exists in event
    if (!event.versions.find((sub) => sub.id === version.id)) {
      await lastValueFrom(
        this.eventService.update({ ...event, versions: [...event.versions, version] }),
      );
    }

    if (confirmed) {
      params = {
        ...params,
        scenarios: [
          ...rerunScenario.map((s) => s.id,
          )],
        force: true
      }

      await lastValueFrom(this.demandService.getDemandImpacts(params))

      for (const scenario of rerunScenario) {
        firstValueFrom(this.simulationSerivce.create({
          scenarioId: scenario.id,
          withUI: scenario.simulateWithUI,
        }))
      }
    }
    return { version, event, confirmed, editEventVersion };
  }
}

/** Create a bare-minimum event object. */
function createDummyEvent(
  name = 'Dummy Event',
  type = EventType.PROMOTION_CAMPAIGN,
): Event {
  return {
    id: '',
    name,
    type,
    versions: [],
  };
}
