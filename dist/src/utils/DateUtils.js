"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
const moment_1 = __importDefault(require("moment"));
class DateUtils {
}
exports.DateUtils = DateUtils;
DateUtils.relativeDate = (input) => {
    // Create new moment instance to apply new locale
    const datetime = moment_1.default.isMoment(input) ? (0, moment_1.default)(input.toDate()) : (0, moment_1.default)(input);
    if (!datetime.isValid()) {
        console.error('core-js:DateUtils.relativeDate() datetime is invalid', datetime);
        return '<INVALID DATE>';
    }
    return datetime.fromNow();
};
DateUtils.setLocale = (language) => {
    moment_1.default.updateLocale(language, {
        relativeTime: DateUtils.getRelativeTimeSpec(language),
    });
};
DateUtils.getRelativeTimeSpec = (locale) => {
    if (locale in DateUtils.relativeTimeSpecs) {
        return DateUtils.relativeTimeSpecs[locale];
    }
    return undefined;
};
(function (DateUtils) {
    DateUtils.relativeTimeSpecs = {
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
        },
        en: {
            future: "in %s",
            past: "%s ago",
            s: number => number === 1 ? `${number}second` : `${number}seconds`,
            ss: number => `${number}seconds`,
            m: number => number === 1 ? `${number}minute` : `${number}minutes`,
            mm: number => `${number}minutes`,
            h: number => number === 1 ? `${number}hour` : `${number}hours`,
            hh: number => `${number}hours`,
            d: number => number === 1 ? `${number}day` : `${number}days`,
            dd: number => `${number}days`,
            M: number => number === 1 ? `${number}month` : `${number}months`,
            MM: number => `${number}months`,
            y: number => number === 1 ? `${number}year` : `${number}years`,
            yy: number => `${number}years`
        },
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
        },
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
        },
    };
})(DateUtils || (exports.DateUtils = DateUtils = {}));
