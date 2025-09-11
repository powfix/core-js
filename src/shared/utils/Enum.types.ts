type NonFunction<T, Type extends "keys" | "values"> = {
  [K in keyof T]: T[K] extends Function ? never : Type extends "keys" ? K : T[K];
} [keyof T] extends infer R ? (R extends never ? never : R) : never;

export type EnumEntry<E extends object> = [NonFunction<E, "keys">, NonFunction<E, "values">];

export type EnumEntries<E extends object> = EnumEntry<E>[];
