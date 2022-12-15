export interface Workspace {
  id: string;
  name: string;
  defaultQuantityUnit: string;
  postSimulationTasks: string[];
  flags?: any;

  actualStartDate: string;
  actualEndDate: string;
  actualInputDatabase: string;
  actualOutputDatabase: string;
}
