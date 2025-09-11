export function fallbackIfNullish<T, F>(value: T | null | undefined, fallback: F): T | F {
  if (value == null) {
    return fallback;
  }
  return value;
}
