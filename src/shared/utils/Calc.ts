export class Calc {
  public static average(...values: number[]): number {
    const length = values.length;
    if (length === 0) {
      return NaN;
    }

    let sum: number = 0;
    for (let i: number = 0; i < length; ++i) {
      sum += values[i];
    }
    return sum / length;
  }

  public static median(...values: number[]): number {
    const len = values.length;
    if (len === 0) return NaN;

    const sorted = values.slice().sort((a, b) => a - b); // O(n log n)
    const mid = len >> 1;

    return len % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }
}
