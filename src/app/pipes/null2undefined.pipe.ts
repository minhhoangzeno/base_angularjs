import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nullToUndefined' })
export class NullToUndefinedPipe implements PipeTransform {
  transform<T>(input: T | null): T | undefined {
    if (input === null) return undefined;
    return input;
  }
}
