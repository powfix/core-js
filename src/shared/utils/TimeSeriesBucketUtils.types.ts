export type DateBucketUnit =
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second';

export type DateBucketInput = string | number | Date;

export type DateBucketRange = readonly [
    DateBucketInput | null | undefined,
    DateBucketInput | null | undefined,
];

export type FilledUtcBucketRow<
  T extends object,
  K extends Extract<keyof T, string>,
> = Omit<Partial<T>, K> & Record<K, string>;

export interface FillMissingUtcBucketsOptions<
  T extends object,
  K extends Extract<keyof T, string>,
> {
  /**
   * 날짜 값이 들어있는 row field key.
   *
   * 해당 field value는 runtime 기준 string | number | Date 여야 한다.
   */
  dateKey: K;

  /**
   * UTC 기준 bucket 단위.
   */
  unit: DateBucketUnit;

  /**
   * 누락된 bucket row에 채워 넣을 값.
   *
   * 예:
   * { count: 0 }
   */
  fillValues?:
    | Omit<Partial<T>, K>
    | ((context: {
    isoDate: string;
    date: Date;
    unit: DateBucketUnit;
  }) => Omit<Partial<T>, K>);

  /**
   * 출력할 bucket range.
   *
   * - [a, b]: 순서와 무관하게 더 과거 값이 start, 더 미래 값이 end
   * - [null, b] 또는 [undefined, b]: b를 end로 사용하고 start는 rows에서 추론
   * - [a, null] 또는 [a, undefined]: a를 start로 사용하고 end는 rows에서 추론
   * - 생략 또는 [null, undefined]: start/end 모두 rows에서 추론
   *
   * number는 JavaScript Date 생성자와 동일하게 millisecond timestamp로 처리된다.
   */
  dateRange?: DateBucketRange;
}
