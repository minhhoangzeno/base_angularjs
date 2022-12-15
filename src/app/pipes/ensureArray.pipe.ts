import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ensureArray' })
export class EnsureArrayPipe implements PipeTransform {
  /** Convert null and undefined value to empty array */
  transform<T extends Array<unknown> | ReadonlyArray<unknown>>(input: T | null | undefined): T {
    if (input === null || input === undefined) return [] as unknown[] as T;
    return input;
  }
}
