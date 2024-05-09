import moment, {MomentInput, RelativeTimeSpec} from "moment";

export class DateUtils {
  public static relativeDate = (input: MomentInput): string => {
    // Create new moment instance to apply new locale
    const datetime = moment.isMoment(input) ? moment(input.toDate()) : moment(input);

    if (!datetime.isValid()) {
      console.error('core-js:DateUtils.relativeDate() datetime is invalid', datetime);
      return '<INVALID DATE>';
    }

    return datetime.fromNow();
  };

  public static setLocale = (language: DateUtils.Locale) => {
    moment.updateLocale(language as string, {
      relativeTime: DateUtils.getRelativeTimeSpec(language),
    });
  };

  private static getRelativeTimeSpec = (locale: DateUtils.Locale): RelativeTimeSpec | undefined => {
    if (locale in DateUtils.relativeTimeSpecs) {
      return DateUtils.relativeTimeSpecs[locale];
    }
    return undefined;
  };
}

export namespace DateUtils {
  export type Locale = keyof typeof DateUtils.relativeTimeSpecs | string

  export const relativeTimeSpecs: {[key: string]: RelativeTimeSpec} = {
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
      M: number => `${number}월`,
      MM: number => `${number}월`,
      y: number => `${number}년`,
      yy: number => `${number}년`
    } as RelativeTimeSpec,
    en: {
      future: "in %s",
      past: "%s ago",
      s: number => number === 1 ? `${number}second`: `${number}seconds`,
      ss: number => `${number}seconds`,
      m: number => number === 1 ? `${number}minute`: `${number}minutes`,
      mm: number => `${number}minutes`,
      h: number => number === 1 ? `${number}hour`: `${number}hours`,
      hh: number => `${number}hours`,
      d: number => number === 1 ? `${number}day`: `${number}days`,
      dd: number => `${number}days`,
      M: number => number === 1 ? `${number}month`: `${number}months`,
      MM: number => `${number}months`,
      y: number => number === 1 ? `${number}year`: `${number}years`,
      yy: number => `${number}years`
    } as RelativeTimeSpec,
    ja: {
      future: "%s 後",
      past: "%s 前",
      s: number => `${number}秒`,
      ss: number => `${number}초`,
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
      future: "%s 后",
      past: "%s 前",
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
      future: "%s keyin",
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
  };
}
