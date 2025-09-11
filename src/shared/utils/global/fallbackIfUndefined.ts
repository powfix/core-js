import {fallbackIfMatch} from "./fallbackIfMatch";

export function fallbackIfUndefined<V, F>(value: V, fallback: F): V | F {
  return fallbackIfMatch(value, undefined, fallback);
}
