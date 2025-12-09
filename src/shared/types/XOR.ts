type Without<T, K> = { [P in Exclude<keyof T, K>]?: never };

export type XOR<T, U> = (
  | (T & Without<U, keyof T>)
  | (U & Without<T, keyof U>)
);
