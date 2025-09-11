export function fallbackIfMatch<V, C, F>(value: V, condition: C, fallback: F): V | F {
  if (typeof value === typeof condition && value === (condition as unknown as V)) {
    return fallback;
  }
  return value;
}
