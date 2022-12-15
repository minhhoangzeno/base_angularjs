import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ILoadMasterIputDataParams } from './input-data.actions';

import { IInputDataPageState, PAGE__INPUT_DATA_STATE_KEY } from './input-data.state';

const selectFeature = createFeatureSelector<IInputDataPageState>(PAGE__INPUT_DATA_STATE_KEY);

export const select_loadingInputData = createSelector(selectFeature, (state) => state.loading);
export const select_loadingEditedInputData = createSelector(
  selectFeature,
  (state) => state.loadingEditied,
);
export const select_inputData = createSelector(selectFeature, (state) => state.data);
export const select_inputDataTotal = createSelector(selectFeature, (state) => state.total);
export const select_editedInputData = createSelector(selectFeature, (state) => state.editedData);

const COLUMN_TITLE_LOOKUP = {
  _id: 'ID',
};
const COLUMN_EDITABLE_LOOKUP = {
  TransportCostPerUnit: true,
};
interface InputDataColumnsDefinition {
  id: string;
  title: string;
  editable: boolean;
}

export const select_inputDataColumns = createSelector(
  selectFeature,
  ({ data }): ReadonlyArray<InputDataColumnsDefinition> => {
    const firstRow = data[0];
    if (!firstRow) return [];
    return Object.keys(firstRow).map(
      (key) =>
        <InputDataColumnsDefinition>{
          id: key,
          title: COLUMN_TITLE_LOOKUP[key] || key,
          editable: COLUMN_EDITABLE_LOOKUP[key] || false,
        },
    );
  },
);
