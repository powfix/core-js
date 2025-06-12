import {fallbackIfEqual} from "./fallbackIfEqual.js";

export function fallbackIfNull<V, F>(value: V, fallback: F): V | F {
  return fallbackIfEqual(value, null, fallback);
}
