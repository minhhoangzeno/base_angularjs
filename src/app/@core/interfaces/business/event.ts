import { Segment } from './segment';
import { TaskStatus } from '../../backend/simcel/task.service';

/** Pairs a list of adjustments that will be applied to a list of segments. */
export interface SegmentImpact {
  segment: Segment;
  adjustments: PromotionCampaignSegmentAdjustments | GeneralPricingSegmentAdjustments;
}

export enum AdjustmentKey {
  DEMAND = 'demand',
  NSV = 'nsv',
  GSV = 'gsv',
}

export enum AdjustmentType {
  PERCENTAGE = 'percentage',
  ABSOLUTE = 'absolute',
}

/** Unit of adjustment. */
export interface Adjustment {
  /** Value of the adjustment. */
  value: number;
  /** Percentage or absolute value. */
  type: AdjustmentType;
}

/** Defines a pricing or demand changes on an event. */
export interface BaseSegmentAdjustments {
  demand: Adjustment;
}

/** Adjustment for product price and demand. Impacts NSV. */
export interface PromotionCampaignSegmentAdjustments extends BaseSegmentAdjustments {
  nsv?: Adjustment;
}

/** Adjustment for product price and demand. Impacts GSV. */
export interface GeneralPricingSegmentAdjustments extends BaseSegmentAdjustments {
  gsv?: Adjustment;
}

/** Adjustment only for demand. */
export type GeneralDemandSegmentAdjustments = BaseSegmentAdjustments;

export enum EventType {
  PROMOTION_CAMPAIGN = 'promotion',
  GENERAL_PRICING = 'pricing adjustment',
  GENERAL_DEMAND = 'demand adjustment',
  NEW_DEMAND_STREAM = 'new_demand_stream',
  INVENTORY_PARAMETERS = 'inventory_parameters',
  PRODUCTION_CAPACIY = 'production_capacity',
  SHELF_LIFE_ACCEPTANCE = 'shelf_life_acceptance',
  MIN_TRUCK_FILL_RATE = 'min_truck_fill_rate',
  MOQ = 'moq',
  COGS = 'cogs',
  STORAGE_HANDLING_COST = 'storage_handling_cost',
  TRANSPORT_COST = 'transport_cost',
}

/** An event that could affect pricing and demand forecast. */
export interface Event {
  id: string;
  name: string;
  type: EventType;
  versions: EventVersion[];
}

/** A revision of an event. */
export interface EventVersion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  segmentImpacts: SegmentImpact[];
  /** Deprecated. ID of the parent event. */
  eventId?: string;
  // A list of task ids of task that are related to this scenario
  tasks?: string[];
  // an obs storing a summarised status of all the related tasks
  tasksSummary?: {
    error?: string;
    status: TaskStatus;
  };
}
