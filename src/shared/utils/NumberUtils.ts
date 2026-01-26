export class NumberUtils {
  public static formatWithThousandsSeparator(value: number, separator: string = ','): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  public static formatThousands(value: number, separator: string = ','): string {
    if (typeof value !== 'number') {
      throw new TypeError(`formatThousands: value must be a number. got ${typeof value}`);
    }
    if (!Number.isFinite(value)) {
      throw new RangeError(`formatThousands: value must be a finite number. got ${value}`);
    }

    const [intPart, fracPart] = String(value).split('.');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return fracPart != null ? `${formattedInt}.${fracPart}` : formattedInt;
  }

  public static formatBigNumber(value: number, precision: number = 2): string {
    const map: {suffix: string, threshold: number}[] = [
      {suffix: 'Qi', threshold: 1e18},
      {suffix: 'Q', threshold: 1e15},
      {suffix: 'T', threshold: 1e12},
      {suffix: 'B', threshold: 1e9},
      {suffix: 'M', threshold: 1e6},
      {suffix: 'K', threshold: 1e3},
      {suffix: '', threshold: 1},
    ];

    const found = map.find(e => Math.abs(value) >= e.threshold);
    if (found) {
      return Number((value / found.threshold).toFixed(precision)) + found.suffix;
    }
    return value.toString();
  }
}
