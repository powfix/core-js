export class SequelizeUtils {
  public static decimal2Number(value: any): number | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    const parsed = Number(value);
    if (isNaN(parsed)) {
      throw new Error(`value(typeof=${typeof value}, value=${value}) iNaN(is not number)`);
    }
    return parsed;
  }
}
