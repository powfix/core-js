import {fallbackIfMatch} from "./fallbackIfMatch";

export function fallbackIfNull<V, F>(value: V, fallback: F): V | F {
  return fallbackIfMatch(value, null, fallback);
}
