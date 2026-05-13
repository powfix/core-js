import {
  DateBucketRange,
  DateBucketUnit,
  FilledUtcBucketRow,
  FillMissingUtcBucketsOptions
} from "./TimeSeriesBucketUtils.types";

export class TimeSeriesBucketUtils {
  private static readonly DATE_BUCKET_UNITS: readonly DateBucketUnit[] = [
    'year',
    'quarter',
    'month',
    'week',
    'day',
    'hour',
    'minute',
    'second',
  ];

  /**
   * 시계열 데이터에서 누락된 UTC bucket row를 채운다.
   *
   * 특징:
   * - 모든 bucket 계산은 UTC 기준으로 처리한다.
   * - 출력 dateKey 값은 항상 ISO 문자열이다.
   * - dateRange가 없으면 rows 내 가장 과거/미래 bucket을 사용한다.
   * - dateRange 양쪽 값이 모두 있으면 순서와 무관하게 더 과거 값이 start가 된다.
   * - 동일 bucket으로 정규화되는 row가 2개 이상이면 throw 한다.
   *
   * 주의:
   * - number date input은 JavaScript Date 생성자와 동일하게 millisecond timestamp로 처리된다.
   * - string date input의 파싱은 new Date(value)에 위임한다.
   */
  public static fillMissingUtcBuckets<
    T extends object,
    K extends Extract<keyof T, string>,
  >(
    rows: readonly T[],
    options: FillMissingUtcBucketsOptions<T, K>,
  ): FilledUtcBucketRow<T, K>[] {
    if (!Array.isArray(rows)) {
      throw new TypeError('rows must be an array.');
    }

    if (!TimeSeriesBucketUtils.isRecord(options)) {
      throw new TypeError('options must be an object.');
    }

    const { dateKey, unit, fillValues, dateRange } = options;

    if (typeof dateKey !== 'string' || dateKey.length === 0) {
      throw new TypeError('dateKey must be a non-empty string.');
    }

    TimeSeriesBucketUtils.assertDateBucketUnit(unit);

    if (dateRange !== undefined) {
      TimeSeriesBucketUtils.assertDateRange(dateRange);
    }

    if (
      fillValues !== undefined &&
      typeof fillValues !== 'function' &&
      !TimeSeriesBucketUtils.isRecord(fillValues)
    ) {
      throw new TypeError('fillValues must be an object or a function.');
    }

    const normalizedRows: Array<{
      row: T;
      isoDate: string;
      bucketTime: number;
    }> = [];

    let minBucketTime: number | undefined;
    let maxBucketTime: number | undefined;

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];

      if (!TimeSeriesBucketUtils.isRecord(row)) {
        throw new TypeError(`rows[${index}] must be an object.`);
      }

      if (!(dateKey in row)) {
        throw new Error(`rows[${index}] does not have dateKey "${dateKey}".`);
      }

      const rawDate = (row as Record<string, unknown>)[dateKey];

      const bucketDate = TimeSeriesBucketUtils.startOfUtcBucket(
        rawDate,
        unit,
        `rows[${index}].${dateKey}`,
      );

      const bucketTime = bucketDate.getTime();
      const isoDate = bucketDate.toISOString();

      normalizedRows.push({
        row,
        isoDate,
        bucketTime,
      });

      minBucketTime =
        minBucketTime === undefined
          ? bucketTime
          : Math.min(minBucketTime, bucketTime);

      maxBucketTime =
        maxBucketTime === undefined
          ? bucketTime
          : Math.max(maxBucketTime, bucketTime);
    }

    const resolvedRange = TimeSeriesBucketUtils.resolveUtcBucketRange(
      minBucketTime,
      maxBucketTime,
      unit,
      dateRange,
    );

    if (resolvedRange === null) {
      return [];
    }

    const { start: rangeStart, end: rangeEnd } = resolvedRange;

    if (rangeStart.getTime() > rangeEnd.getTime()) {
      throw new Error(
        'Resolved dateRange start must be less than or equal to resolved dateRange end.',
      );
    }

    const rangeStartTime = rangeStart.getTime();
    const rangeEndTime = rangeEnd.getTime();

    const bucketMap = new Map<string, FilledUtcBucketRow<T, K>>();

    for (const normalizedRow of normalizedRows) {
      if (
        normalizedRow.bucketTime < rangeStartTime ||
        normalizedRow.bucketTime > rangeEndTime
      ) {
        continue;
      }

      if (bucketMap.has(normalizedRow.isoDate)) {
        throw new Error(
          `Duplicate UTC bucket detected for "${dateKey}": ${normalizedRow.isoDate}. ` +
          'Pre-aggregate or de-duplicate rows before calling fillMissingUtcBuckets.',
        );
      }

      bucketMap.set(normalizedRow.isoDate, {
        ...normalizedRow.row,
        [dateKey]: normalizedRow.isoDate,
      } as FilledUtcBucketRow<T, K>);
    }

    const result: FilledUtcBucketRow<T, K>[] = [];

    const resolvedFillValues =
      fillValues === undefined ? ({} as Omit<Partial<T>, K>) : fillValues;

    let cursor = rangeStart;

    while (cursor.getTime() <= rangeEndTime) {
      const isoDate = cursor.toISOString();
      const existingRow = bucketMap.get(isoDate);

      if (existingRow) {
        result.push(existingRow);
      } else {
        const valuesToFill =
          typeof resolvedFillValues === 'function'
            ? resolvedFillValues({
              isoDate,
              date: new Date(cursor.getTime()),
              unit,
            })
            : resolvedFillValues;

        if (!TimeSeriesBucketUtils.isRecord(valuesToFill)) {
          throw new TypeError('fillValues function must return an object.');
        }

        result.push({
          ...valuesToFill,
          [dateKey]: isoDate,
        } as FilledUtcBucketRow<T, K>);
      }

      cursor = TimeSeriesBucketUtils.addUtcBucketUnit(cursor, unit);
    }

    return result;
  }

  private static resolveUtcBucketRange(
    minBucketTime: number | undefined,
    maxBucketTime: number | undefined,
    unit: DateBucketUnit,
    dateRange: DateBucketRange | undefined,
  ): { start: Date; end: Date } | null {
    const hasRows =
      minBucketTime !== undefined && maxBucketTime !== undefined;

    if (dateRange === undefined) {
      if (!hasRows) {
        return null;
      }

      return {
        start: TimeSeriesBucketUtils.startOfUtcBucket(
          minBucketTime,
          unit,
          'inferred dateRange start',
        ),
        end: TimeSeriesBucketUtils.startOfUtcBucket(
          maxBucketTime,
          unit,
          'inferred dateRange end',
        ),
      };
    }

    const [left, right] = dateRange;

    const hasLeft = left !== null && left !== undefined;
    const hasRight = right !== null && right !== undefined;

    if (!hasLeft && !hasRight) {
      if (!hasRows) {
        return null;
      }

      return {
        start: TimeSeriesBucketUtils.startOfUtcBucket(
          minBucketTime,
          unit,
          'inferred dateRange start',
        ),
        end: TimeSeriesBucketUtils.startOfUtcBucket(
          maxBucketTime,
          unit,
          'inferred dateRange end',
        ),
      };
    }

    if (hasLeft && hasRight) {
      const leftBucket = TimeSeriesBucketUtils.startOfUtcBucket(
        left,
        unit,
        'dateRange[0]',
      );

      const rightBucket = TimeSeriesBucketUtils.startOfUtcBucket(
        right,
        unit,
        'dateRange[1]',
      );

      if (leftBucket.getTime() <= rightBucket.getTime()) {
        return {
          start: leftBucket,
          end: rightBucket,
        };
      }

      return {
        start: rightBucket,
        end: leftBucket,
      };
    }

    if (hasLeft) {
      if (!hasRows) {
        throw new Error(
          'dateRange[1] is nullish, so rows are required to infer dateRange end.',
        );
      }

      return {
        start: TimeSeriesBucketUtils.startOfUtcBucket(
          left,
          unit,
          'dateRange[0]',
        ),
        end: TimeSeriesBucketUtils.startOfUtcBucket(
          maxBucketTime,
          unit,
          'inferred dateRange end',
        ),
      };
    }

    if (!hasRows) {
      throw new Error(
        'dateRange[0] is nullish, so rows are required to infer dateRange start.',
      );
    }

    return {
      start: TimeSeriesBucketUtils.startOfUtcBucket(
        minBucketTime,
        unit,
        'inferred dateRange start',
      ),
      end: TimeSeriesBucketUtils.startOfUtcBucket(
        right,
        unit,
        'dateRange[1]',
      ),
    };
  }

  private static startOfUtcBucket(
    value: unknown,
    unit: DateBucketUnit,
    argumentName: string,
  ): Date {
    const date = TimeSeriesBucketUtils.toDate(value, argumentName);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();

    switch (unit) {
      case 'year':
        return new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));

      case 'quarter': {
        const quarterStartMonth = Math.floor(month / 3) * 3;

        return new Date(Date.UTC(year, quarterStartMonth, 1, 0, 0, 0, 0));
      }

      case 'month':
        return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

      case 'week': {
        /**
         * UTC 기준 Monday 00:00:00.000Z 시작.
         *
         * getUTCDay()
         * - Sunday: 0
         * - Monday: 1
         * - Tuesday: 2
         * - ...
         * - Saturday: 6
         */
        const dayOfWeek = new Date(Date.UTC(year, month, day)).getUTCDay();
        const daysSinceMonday = (dayOfWeek + 6) % 7;

        return new Date(
          Date.UTC(year, month, day - daysSinceMonday, 0, 0, 0, 0),
        );
      }

      case 'day':
        return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

      case 'hour':
        return new Date(Date.UTC(year, month, day, hour, 0, 0, 0));

      case 'minute':
        return new Date(Date.UTC(year, month, day, hour, minute, 0, 0));

      case 'second':
        return new Date(Date.UTC(year, month, day, hour, minute, second, 0));
    }
  }

  private static addUtcBucketUnit(date: Date, unit: DateBucketUnit): Date {
    const next = new Date(date.getTime());

    switch (unit) {
      case 'year':
        next.setUTCFullYear(next.getUTCFullYear() + 1);
        break;

      case 'quarter':
        next.setUTCMonth(next.getUTCMonth() + 3);
        break;

      case 'month':
        next.setUTCMonth(next.getUTCMonth() + 1);
        break;

      case 'week':
        next.setUTCDate(next.getUTCDate() + 7);
        break;

      case 'day':
        next.setUTCDate(next.getUTCDate() + 1);
        break;

      case 'hour':
        next.setUTCHours(next.getUTCHours() + 1);
        break;

      case 'minute':
        next.setUTCMinutes(next.getUTCMinutes() + 1);
        break;

      case 'second':
        next.setUTCSeconds(next.getUTCSeconds() + 1);
        break;
    }

    return TimeSeriesBucketUtils.startOfUtcBucket(next, unit, 'date');
  }

  private static toDate(value: unknown, argumentName: string): Date {
    const isSupportedDateInput = typeof value === 'string' || typeof value === 'number' || value instanceof Date;

    if (!isSupportedDateInput) {
      throw new TypeError(
        `${argumentName} must be a string, number timestamp, or Date instance.`,
      );
    }

    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new Error(`${argumentName} must be a valid date value.`);
    }

    return date;
  }

  private static assertDateBucketUnit(unit: unknown): asserts unit is DateBucketUnit {
    if (!TimeSeriesBucketUtils.DATE_BUCKET_UNITS.includes(unit as DateBucketUnit)) {
      throw new TypeError(
        `unit must be one of: ${TimeSeriesBucketUtils.DATE_BUCKET_UNITS.join(', ')}.`,
      );
    }
  }

  private static assertDateRange(
    dateRange: unknown,
  ): asserts dateRange is DateBucketRange {
    if (!Array.isArray(dateRange) || dateRange.length !== 2) {
      throw new TypeError(
        'dateRange must be a tuple with exactly two items.',
      );
    }
  }

  private static isRecord<TValue>(value: TValue): value is TValue & Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
