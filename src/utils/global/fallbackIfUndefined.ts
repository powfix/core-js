export function fallbackIfUndefined<V, F>(value: V, fallback: F): V | F {
  return value === undefined ? fallback : value;
}
