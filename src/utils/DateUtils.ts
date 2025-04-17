import moment, {MomentInput, RelativeTimeSpec} from "moment";
import {DATE} from "../constants/DATE";

export class DateUtils {
  public static isPositiveInteger(value: unknown, strict?: boolean): boolean {
    if (strict) {
      if (typeof value !== 'number') {
        return false;
      }
    }

    if (typeof value === 'bigint') {
      return value >= 0 && value <= Number.MAX_SAFE_INTEGER;
    }

    if (typeof value === 'number') {
      if (!Number.isSafeInteger(value)) {
        return false;
      }
      return value >= 0 && value <= Number.MAX_SAFE_INTEGER;
    }

    if (typeof value === 'string') {
      if (!/^(0|[1-9]\d*)$/g.test(value)) {
        return false;
      }
      return DateUtils.isPositiveInteger(Number(value), strict);
    }

    return false;
  }

  public static isMilliseconds(value: unknown, strict?: boolean): boolean {
    return DateUtils.isPositiveInteger(value, strict);
  }

  public static isSeconds(value: unknown, strict?: boolean): boolean {
    return DateUtils.isPositiveInteger(value, strict);
  }

  public static isUnix(value: unknown, strict?: boolean): boolean {
    return DateUtils.isSeconds(value, strict);
  }

  public static isISO8601(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    if (!/(Z)|(\+\d{2}:\d{2})$/g.test(value)) {
      return false;
    }

    return !Number.isNaN((new Date(value)).getTime());
  }

  public static isValid(value: unknown, format?: DATE.FORMAT, strict?: boolean): boolean {
    if (format === undefined) {
      return DateUtils.isSeconds(value, strict) || DateUtils.isMilliseconds(value, strict) || DateUtils.isISO8601(value);
    } else {
      switch (format) {
        case DATE.FORMAT.UNIX: return DateUtils.isUnix(value, strict);
        case DATE.FORMAT.SECONDS: return DateUtils.isSeconds(value, strict);
        case DATE.FORMAT.MILLISECONDS: return DateUtils.isMilliseconds(value, strict);
        case DATE.FORMAT.ISO_8601: return DateUtils.isISO8601(value);
        default: {
          throw new Error(`unknown format: ${format}(${DATE.FORMAT.toString(format) ?? 'unknown'})`);
        }
      }
    }
  }

  public static relativeDate = (input: MomentInput, base: MomentInput = Date.now()): string => {
    // Create new moment instance to apply new locale
    const datetime = moment.isMoment(input) ? moment(input.toDate()) : moment(input);

    if (!datetime.isValid()) {
      console.error('core-js:DateUtils.relativeDate() datetime is invalid', datetime);
      return '<INVALID DATE>';
    }

    return datetime.from(base);
  };

  public static setLocale = (language: DateUtils.Locale) => {
    const relativeTime = DateUtils.getRelativeTimeSpec(language);
    if (relativeTime !== undefined) {
      moment.updateLocale(language, {relativeTime});
    }
    moment.locale(language);
  };

  private static getRelativeTimeSpec = (locale: DateUtils.Locale): RelativeTimeSpec | undefined => {
    if (locale in DateUtils.relativeTimeSpecs) {
      return DateUtils.relativeTimeSpecs[locale];
    }
    return undefined;
  };
}

export namespace DateUtils {
  export type Locale = string;

  export const relativeTimeSpecs: {[key: Locale]: RelativeTimeSpec} = {
    ko: {
      future: "%s 후",
      past: "%s 전",
      s: number => `${number}초`,
      ss: number => `${number}초`,
      m: number => `${number}분`,
      mm: number => `${number}분`,
      h: number => `${number}시간`,
      hh: number => `${number}시간`,
      d: number => `${number}일`,
      dd: number => `${number}일`,
      M: number => `${number}개월`,
      MM: number => `${number}개월`,
      y: number => `${number}년`,
      yy: number => `${number}년`
    } as RelativeTimeSpec,
    en: {
      future: "in %s",
      past: "%s ago",
      s: number => number === 1 ? `${number} second`: `${number} seconds`,
      ss: number => `${number} seconds`,
      m: number => number === 1 ? `${number} minute`: `${number} minutes`,
      mm: number => `${number} minutes`,
      h: number => number === 1 ? `${number} hour`: `${number} hours`,
      hh: number => `${number} hours`,
      d: number => number === 1 ? `${number} day`: `${number} days`,
      dd: number => `${number} days`,
      M: number => number === 1 ? `${number} month`: `${number} months`,
      MM: number => `${number} months`,
      y: number => number === 1 ? `${number} year`: `${number} years`,
      yy: number => `${number} years`
    } as RelativeTimeSpec,
    ja: {
      future: "%s後",
      past: "%s前",
      s: number => `${number}秒`,
      ss: number => `${number}秒`,
      m: number => `${number}分`,
      mm: number => `${number}分`,
      h: number => `${number}時`,
      hh: number => `${number}時`,
      d: number => `${number}日`,
      dd: number => `${number}日`,
      M: number => `${number}月`,
      MM: number => `${number}月`,
      y: number => `${number}年`,
      yy: number => `${number}年`
    } as RelativeTimeSpec,
    zh: {
      future: "%s后",
      past: "%s前",
      s: number => `${number}秒`,
      ss: number => `${number}秒`,
      m: number => `${number}分钟`,
      mm: number => `${number}分钟`,
      h: number => `${number}个小时`,
      hh: number => `${number}个小时`,
      d: number => `${number}天`,
      dd: number => `${number}天`,
      M: number => `${number}个月`,
      MM: number => `${number}个月`,
      y: number => `${number}年`,
      yy: number => `${number}年`
    } as RelativeTimeSpec,
    ru: {
      future: "через %s",
      past: "%s назад",
      s: number => `${number} секунд`,
      ss: number => `${number} секунд`,
      m: number => `${number} минута`,
      mm: number => `${number} минут`,
      h: number => `${number} час`,
      hh: number => `${number} часов`,
      d: number => `${number} день`,
      dd: number => `${number} дней`,
      M: number => `${number} месяц`,
      MM: number => `${number} месяцев`,
      y: number => `${number} год`,
      yy: number => `${number} лет`
    } as RelativeTimeSpec,
    uz: {
      future: "%sdan keyin",
      past: "%s avval",
      s: number => `${number} soniya`,
      ss: number => `${number} soniya`,
      m: number => `${number} daqiqa`,
      mm: number => `${number} daqiqa`,
      h: number => `${number} soat`,
      hh: number => `${number} soat`,
      d: number => `${number} kun`,
      dd: number => `${number} kun`,
      M: number => `${number} oy`,
      MM: number => `${number} oy`,
      y: number => `${number} yil`,
      yy: number => `${number} yil`
    } as RelativeTimeSpec,
    de: {
      future: "in %s",
      past: "vor %s",
      s: number => `${number === 1 ? "einer" : number} Sekunde${number === 1 ? "" : "n"}`,
      ss: number => `${number} Sekunde${number === 1 ? "" : "n"}`,
      m: number => `${number === 1 ? "einer" : number} Minute${number === 1 ? "" : "n"}`,
      mm: number => `${number} Minute${number === 1 ? "" : "n"}`,
      h: number => `${number === 1 ? "einer" : number} Stunde${number === 1 ? "" : "n"}`,
      hh: number => `${number} Stunde${number === 1 ? "" : "n"}`,
      d: number => `${number === 1 ? "einem" : number} Tag${number === 1 ? "" : "en"}`,
      dd: number => `${number} Tag${number === 1 ? "" : "en"}`,
      M: number => `${number === 1 ? "einem" : number} Monat${number === 1 ? "" : "en"}`,
      MM: number => `${number} Monat${number === 1 ? "" : "en"}`,
      y: number => `${number === 1 ? "einem" : number} Jahr${number === 1 ? "" : "en"}`,
      yy: number => `${number} Jahr${number === 1 ? "" : "en"}`
    } as RelativeTimeSpec,
    fr: {
      future: "dans %s",
      past: "il y a %s",
      s: number => `quelques secondes`,
      ss: number => `${number} secondes`,
      m: number => `une minute`,
      mm: number => `${number} minutes`,
      h: number => `une heure`,
      hh: number => `${number} heures`,
      d: number => `un jour`,
      dd: number => `${number} jours`,
      M: number => `un mois`,
      MM: number => `${number} mois`,
      y: number => `un an`,
      yy: number => `${number} ans`
    } as RelativeTimeSpec,
    vi: {
      future: "sau %s",
      past: "%s trước",
      s: number => `${number} giây`,
      ss: number => `${number} giây`,
      m: number => `${number} phút`,
      mm: number => `${number} phút`,
      h: number => `${number} giờ`,
      hh: number => `${number} giờ`,
      d: number => `${number} ngày`,
      dd: number => `${number} ngày`,
      M: number => `${number} tháng`,
      MM: number => `${number} tháng`,
      y: number => `${number} năm`,
      yy: number => `${number} năm`
    } as RelativeTimeSpec,
    th: {
      future: "ใน %s",
      past: "%s ที่แล้ว",
      s: number => `${number} วินาที`,
      ss: number => `${number} วินาที`,
      m: number => `${number} นาที`,
      mm: number => `${number} นาที`,
      h: number => `${number} ชั่วโมง`,
      hh: number => `${number} ชั่วโมง`,
      d: number => `${number} วัน`,
      dd: number => `${number} วัน`,
      M: number => `${number} เดือน`,
      MM: number => `${number} เดือน`,
      y: number => `${number} ปี`,
      yy: number => `${number} ปี`
    } as RelativeTimeSpec,
    fil: {
      future: "sa loob ng %s",
      past: "%s ang nakalipas",
      s: number => `${number} segundo`,
      ss: number => `${number} segundo`,
      m: number => `${number} minuto`,
      mm: number => `${number} minuto`,
      h: number => `${number} oras`,
      hh: number => `${number} oras`,
      d: number => `${number} araw`,
      dd: number => `${number} araw`,
      M: number => `${number} buwan`,
      MM: number => `${number} buwan`,
      y: number => `${number} taon`,
      yy: number => `${number} taon`
    } as RelativeTimeSpec,
  };
}
