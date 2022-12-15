import { SegmentImpact } from '../../../../../@core/interfaces/business/event';

/** Delete some extra info that won't probably be useful in the presentation. */
export function sanitize(object?: Record<string, any>, scrub = false, copy = false) {
  if (!object) return object;

  if (copy) {
    object = JSON.parse(JSON.stringify(object)) as Record<string, unknown>;
  }

  if (scrub && !!object['id']) delete object['id'];
  delete object['_id'];
  delete object['createdAt'];
  delete object['updatedAt'];
  return object;
}

/** Returns a copy of segment impact with recursively sanitized fields.  */
export function sanitizeSegmentImpact(segmentImpact: SegmentImpact): SegmentImpact {
  const copy = JSON.parse(JSON.stringify(segmentImpact));
  sanitize(copy);

  sanitize(copy.segment, true);
  (copy.segment?.segmentCriteria || []).forEach((_: any, index: string | number) => {
    sanitize(copy.segment?.segmentCriteria[index], true);
    (copy.segment?.segmentCriteria[index].customers || []).forEach(
      (_: any, subindex: string | number) => {
        sanitize(copy.segment?.segmentCriteria[index].customers[subindex], true);
      },
    );
    (copy.segment?.segmentCriteria[index].products || []).forEach(
      (_: any, subindex: string | number) => {
        sanitize(copy.segment?.segmentCriteria[index].products[subindex], true);
      },
    );
  });

  sanitize(copy.adjustments, true);
  sanitize(copy.adjustments?.demand, true);
  sanitize(copy.adjustments?.gsv, true);
  sanitize(copy.adjustments?.nsv, true);

  return copy;
}
