import {fallbackIfEqual} from "./fallbackIfEqual.js";

export function fallbackIfUndefined<V, F>(value: V, fallback: F): V | F {
  return fallbackIfEqual(value, undefined, fallback);
}
