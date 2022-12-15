import { DefaultDataServiceConfig, EntityDataModuleConfig } from '@ngrx/data';
import { environment } from '../../../environments/environment';
import { Breakdown } from '../interfaces/business/breakdown';

/** Config for mapping entity to generated REST services. */
export const entityConfig: EntityDataModuleConfig = {
  entityMetadata: {
    Plan: {
      entityName: 'explorer/plans',
    },
    PlanImport: {
      entityName: 'explorer/plan-imports',
    },
    Scenario: {
      entityName: 'explorer/scenarios',
    },
    Segment: {
      entityName: 'explorer/segments',
    },
    Breakdown: {
      entityName: 'kpis/aggregate',
      selectId: (breakdown: Breakdown) =>
        Object.entries(breakdown._id!)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([, val]) => String(val))
          .join('-'),
    },
    Event: {
      entityName: 'explorer/events',
    },
    EventVersion: {
      entityName: 'explorer/event-versions',
    },
    Comment: {
      entityName: 'explorer/comments',
    },
  },
};

/** Modify root API URL for explorer module. */
export const explorerDataServiceConfig: DefaultDataServiceConfig = {
  root: `${environment.apiUrl}`,
};
