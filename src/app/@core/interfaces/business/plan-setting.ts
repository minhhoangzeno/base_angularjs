/**
 * Defines a plan setting. A plan setting contains the setting of plan to visulization for each user
 */
export declare interface PlanSetting {
  id: string;
  planRef: string;
  userId: string;
  displayedScenarios?: string[];
}
