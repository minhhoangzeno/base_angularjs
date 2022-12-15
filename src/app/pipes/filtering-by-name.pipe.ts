import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filteringByName' })
export class FilteringByNamePipe implements PipeTransform {
  transform<T extends Array<unknown> | ReadonlyArray<unknown>>(
    items: T | null | undefined,
    filterQuery: any,
  ): T {
    if (!items) return [] as unknown[] as T;
    if (!filterQuery) return items;

    return items.filter((item: any) => item.name.toLowerCase().includes(filterQuery.toLowerCase())) as T;
  }
}
