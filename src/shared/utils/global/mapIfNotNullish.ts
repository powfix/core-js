export function mapIfNotNullish<T, R>(
  input: T,
  callback: (value: NonNullable<T>) => R
): R | (T & (null | undefined)) {
  if (input == null) {
    return input as (T & (null | undefined));
  }
  return callback(input as NonNullable<T>);
}
