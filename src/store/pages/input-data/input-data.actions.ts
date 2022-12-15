import { createAction, props } from '@ngrx/store';

export interface IGetMasterIputDataTotalParams {
  collection: string;
  database: string;
}
export interface ILoadMasterIputDataParams extends IGetMasterIputDataTotalParams {
  skip?: number;
  limit?: number;
}
export interface ILoadEditedMasterIputDataParams extends IGetMasterIputDataTotalParams {
  scenarioId: string;
}
export interface IUpsertMasterIputDataParams extends ILoadEditedMasterIputDataParams {
  row: any;
}

export const AVAILABLE_MASTER_INPUT_COLLECTIONS: ReadonlyArray<{ id: string; title: string }> = [
  { title: 'Transport Cost Master', id: 'TransportCostMaster' },
  { title: 'Product Master', id: 'ProductMaster' },
  { title: 'Facility Master', id: 'FacilityMaster' },
  { title: 'Physical Network', id: 'PhysicalNetwork' },
];

export const LOAD_INPUT_DATA = createAction(
  '[⚡ Master Input Data API] Load Data',
  props<{ params: ILoadMasterIputDataParams }>(),
);
export const LOAD_INPUT_DATA_SUCCESS = createAction(
  '[🤖 Master Input Data API] Load Data success',
  props<{ data: ReadonlyArray<any> }>(),
);
export const LOAD_INPUT_DATA_FAILED = createAction(
  '[🤖 Master Input Data API] Load Data failed',
  props<{ error: any }>(),
);
export const LOAD_INPUT_DATA_TOTAL = createAction(
  '[⚡ Master Input Data API] Load Data Total count',
  props<{ params: IGetMasterIputDataTotalParams }>(),
);
export const LOAD_INPUT_DATA_TOTAL_SUCCESS = createAction(
  '[🤖 Master Input Data API] Load Data Total count success',
  props<{ count: number }>(),
);
export const LOAD_INPUT_DATA_TOTAL_FAILED = createAction(
  '[🤖 Master Input Data API] Load Data Total count failed',
  props<{ error: any }>(),
);

export const LOAD_EDITED_INPUT_DATA = createAction(
  '[⚡ Master Input Data API] Load Edited Data',
  props<{ params: ILoadEditedMasterIputDataParams }>(),
);
export const LOAD_EDITED_INPUT_DATA_SUCCESS = createAction(
  '[🤖 Master Input Data API] Load Edited Data success',
  props<{ data: ReadonlyArray<any> }>(),
);
export const LOAD_EDITED_INPUT_DATA_FAILED = createAction(
  '[🤖 Master Input Data API] Load Edited Data failed',
  props<{ error: any }>(),
);

export const UPSERT_INPUT_DATA = createAction(
  '[⚡ Master Input Data API] Update Input Data',
  props<{ params: IUpsertMasterIputDataParams }>(),
);
export const UPSERT_INPUT_DATA_SUCCESS = createAction(
  '[🤖 Master Input Data API] Update Input Data success',
  props<{ row: any }>(),
);
export const UPSERT_INPUT_DATA_FAILED = createAction(
  '[🤖 Master Input Data API] Update Input Data failed',
  props<{ error: any }>(),
);
