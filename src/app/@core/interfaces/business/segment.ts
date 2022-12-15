export interface ProductCriterion {
  brand?: string;
  productFamily?: string;
  groups?: string[];

  // TODO: Consider deletion / refactoring. These are old props.
  category?: string;
  brands?: string;
  productRange?: string;
  subCategory?: string;
  // productIds: string[];
}

export interface CustomerCriterion {
  country?: string;
  city?: string;
  channel?: string;
  groups?: string[];
}

export class SegmentCriterion {
  products?: ProductCriterion[];
  customers?: CustomerCriterion[];
}

export interface MatchingEntities {
  productIds: string[];
  customerRefs: string[];
}

export interface SegmentFilter {
  [key: string]: string[];
}

export const enum SegmentType {
  Filter = 'filter',
  Event = 'event',
}

/** Defines a segment that specifies the impact of an event. */
export class Segment {
  id?: string;
  formatVersion?: string;
  name?: string;
  type?: SegmentType;
  customer?: SegmentFilter[];
  product?: SegmentFilter[];
  location?: SegmentFilter[];

  // event segment
  segmentCriteria?: SegmentCriterion[];
  segmentCriteriaTable?: { [key: string]: SegmentCriterion[] };
  matchingEntities?: MatchingEntities[];
}

export const DEFAULT_SEGMENT: Segment = {
  formatVersion: '1',
  name: '',
  type: SegmentType.Filter,
  location: [],
  product: [],
  customer: [],
};
