import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'defaultTo' })
export class DefaultToPipe implements PipeTransform {
  transform<T>(input: T | null | undefined, fallback: T) {
    if (input === null || input === undefined) return fallback;
    return input;
  }
}
