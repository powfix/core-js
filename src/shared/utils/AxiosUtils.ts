import {AxiosHeaderValue} from "axios";

export class AxiosUtils {
  public static headerValue2String(value: AxiosHeaderValue | undefined): string | null {
    if (value === undefined) {
      return null;
    }

    if (value === null || typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        for (const e of value) {
          if (typeof e === 'string') {
            return e;
          }
        }
        // There is no any values having string type
        return null;
      } else {
        return null;
      }
    }

    return String(value);
  }

  public static headerValue2Number(value: AxiosHeaderValue | undefined): number | null {
    if (value === undefined) {
      return null;
    }

    if (value === null || typeof value === 'number') {
      return value;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        for (const e of value) {
          if (typeof e === 'number') {
            return e;
          }
        }
        // There is no any values having string type
        return null;
      } else {
        return null;
      }
    }

    const result = Number(value);
    return isNaN(result) ? null : result;
  }
}
