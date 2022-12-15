import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpiFormatting',
})
export class KpiFormattingPipe implements PipeTransform {
  transform(input: string | number | null): string {
    if (input === null) return '-';
    return transformInputToKpiFormat(input);
  }
}

/**
 * Transforms an large input number values into a human-readable string format. Set the param
 * `fallbackValueOnInvalid` to return an alternate string if the input is not a valid number.
 *
 * For example:
 * ```
 * transformInputToKpiFormat(1000)          === '1k'
 * transformInputToKpiFormat(2345678)       === '2.34M'
 * transformInputToKpiFormat('test', '---') === '---'
 * ```
 */
// change formate toFixed(1);
export function transformInputToKpiFormat(
  input?: string | number | null,
  fallbackValueOnInvalid?: string,
): string {
  if (fallbackValueOnInvalid) {
    if (typeof input !== 'number' || Number.isNaN(input) || input == null || input == undefined) {
      return fallbackValueOnInvalid;
    }
  }

  if (Number.isNaN(input) || input == null || input == undefined) return '';
  if (typeof input === 'string') input = parseFloat(input);

  const suffixes = ['k', 'M', 'B', 'T'];

  if (-1000 < input && input < 1000) {
    return input.toFixed(1);
  }

  const inputIsNegative = Math.sign(input);
  input = Math.abs(input);

  const exp = Math.floor(Math.log(input) / Math.log(1000));

  return ((input / Math.pow(1000, exp)) * inputIsNegative).toFixed(1) + ' ' + suffixes[exp - 1];
}
