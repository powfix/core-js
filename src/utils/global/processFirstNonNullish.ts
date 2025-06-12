import {firstNonNullish} from "./firstNonNullish.js";

export function processFirstNonNullish<T, R>(processor: (nonNullish: NonNullable<T>) => R, ...args: T[]): R | undefined {
  const fallback = firstNonNullish(...args);
  if (fallback == null) {
    return undefined;
  }
  return processor(fallback);
}
