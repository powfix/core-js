export type XOR<T extends any[]> = XORBuild<
  T,
  XORCollectKeys<T, never>,
  never
>;

type XORCollectKeys<T extends any[], R> =
  T["length"] extends 0
    ? R
    : XORCollectKeys<RemoveFirst<T>, keyof T[0] | R>;

type RemoveFirst<T extends any[]> =
  T extends [any, ...infer Rest] ? Rest : never;

type XORBuild<
  T extends any[],
  K extends keyof any,
  R
> =
  T["length"] extends 0
    ? R
    : XORBuild<
      RemoveFirst<T>,
      K,
      | R
      | (
      // 현재 타입 T[0] 에 없는 키들을 모두 Optional + undefined 로 만들고
      Partial<Record<Exclude<K, keyof T[0]>, undefined>>
      // T[0] 과 합침
      & T[0]
      )
    >;
