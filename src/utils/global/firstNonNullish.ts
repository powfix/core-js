export function firstNonNullish<T>(...args: T[]): NonNullable<T> | undefined {
  if (args == null || !Array.isArray(args) || args.length === 0) {
    return undefined;
  }

  if (args[0] != null) {
    // Not Nullish
    return args[0];
  }

  return firstNonNullish(...args.slice(1));
}
