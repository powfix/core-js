type NonFunction<T, Type extends "keys" | "values"> = {
  [K in keyof T]: T[K] extends Function ? never : Type extends "keys" ? K : T[K];
} [keyof T] extends infer R ? (R extends never ? never : R) : never;

type PureEnumReturnType<E extends object> = [NonFunction<E, "keys">, NonFunction<E, "values">][];

/**
 * @deprecated Use Enum instead.
 */
export function pureEnum<E extends object>(e: E) {
  return Object.entries(e).filter(([key, value]) => !/^-?\d+$/g.test(key) && typeof value !== 'function') as PureEnumReturnType<E>;
}

/**
 * @deprecated Use Enum instead.
 */
export function pureEnumKeys<E extends object>(e: E) {
  return pureEnum<E>(e).map(([key]) => key)
}

/**
 * @deprecated Use Enum instead.
 */
export function pureEnumValues<E extends object>(e: E) {
  return pureEnum<E>(e).map(([, value]) => value)
}
