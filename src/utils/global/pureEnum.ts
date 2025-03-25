type NonFunction<T, Type extends "keys" | "values"> = {
  [K in keyof T]: T[K] extends Function ? never : Type extends "keys" ? K : T[K];
} [keyof T] extends infer R ? (R extends never ? never : R) : never;

type PureEnumReturnType<E extends object> = [NonFunction<E, "keys">, NonFunction<E, "values">][];

export function pureEnum<E extends object>(e: E) {
  return Object.entries(e).filter(([key, value]) => !/^\d+$/g.test(key) && typeof value !== 'function') as PureEnumReturnType<E>;
}

