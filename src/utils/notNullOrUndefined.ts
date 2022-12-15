export function notNullOrUndefined<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false;
  return true;
}
