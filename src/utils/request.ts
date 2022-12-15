import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { QueryParams } from '@ngrx/data';

/** Converts a bunch of query params into a query compatible with nestjsx-crud filters. */
export function q(params: QueryParams): string {
  const qb = RequestQueryBuilder.create();
  Object.entries(params).forEach(([field, value]) =>
    qb.setFilter({ field, operator: '$eq', value }),
  );
  return qb.query();
}
