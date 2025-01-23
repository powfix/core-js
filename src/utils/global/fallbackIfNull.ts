export function fallbackIfNull<V, F>(value: V, fallback: F): V | F {
  return value === null ? fallback : value;
}
