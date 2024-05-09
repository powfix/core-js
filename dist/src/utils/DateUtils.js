"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
const moment_1 = __importDefault(require("moment"));
// interface PrettyDateOptions {
//   enableSeconds?: boolean;              // 초단위 표시 여부
//
//   spacePrefixBeforeAfter?: boolean;     // 전/후 앞 띄워쓰기 유무
// }
class DateUtils {
}
exports.DateUtils = DateUtils;
/* eslint-disable no-mixed-operators */
// static prettyDate = (time: Moment | MomentInput, options?: PrettyDateOptions) => {
//   const now = moment();
//   const date = moment.isMoment(time) ? time : moment(time);
//
//   const diff = now.diff(date, "seconds");
//   const day_diff = now.diff(date, "days");
//
//   const prefixBeforeAfter: string = options?.spacePrefixBeforeAfter ? ' ' : '';
//
//   if (day_diff === 0) {
//     if (diff >= 0) {
//       return (
//         (diff < 60 && (options?.enableSeconds ? `${diff}초${prefixBeforeAfter}전` : `방금${prefixBeforeAfter}전`)) ||
//         (diff < 120 && `1분${prefixBeforeAfter}전`) ||
//         (diff < 3600 && Math.floor(diff / 60) + `분${prefixBeforeAfter}전`) ||
//         (diff < 7200 && `1시간${prefixBeforeAfter}전`) ||
//         (diff < 86400 && Math.floor(diff / 3600) + `시간${prefixBeforeAfter}전`)
//       );
//     } else {
//       return (
//         (diff > -60 && `잠시${prefixBeforeAfter}후`) ||
//         (diff > -120 && `1분${prefixBeforeAfter}후`) ||
//         (diff > -3600 && Math.floor(diff / 60) + `분${prefixBeforeAfter}후`) ||
//         (diff > -7200 && `1시간${prefixBeforeAfter}후`) ||
//         (diff > -86400 && Math.floor(diff / 3600) + `시간${prefixBeforeAfter}후`)
//       );
//     }
//   } else {
//     if (day_diff === 1) return `어제`;
//     if (day_diff === -1) return `내일`;
//
//     if (day_diff >= 0) {
//       return (
//         (day_diff < 7 && day_diff + `일${prefixBeforeAfter}전`) ||
//         (day_diff < 31 && Math.floor(day_diff / 7) + `주${prefixBeforeAfter}전`) ||
//         (day_diff < 360 && Math.floor(day_diff / 30) + `개월${prefixBeforeAfter}전`) ||
//         (day_diff >= 360 && (Math.floor(day_diff / 360) === 0 ? 1 : Math.floor(day_diff / 360)) + `년${prefixBeforeAfter}전`)
//       );
//     } else {
//       return (
//         (day_diff < 7 && day_diff + `일${prefixBeforeAfter}후`) ||
//         (day_diff < 31 && Math.floor(day_diff / 7) + `주${prefixBeforeAfter}후`) ||
//         (day_diff < 360 && Math.floor(day_diff / 30) + `개월${prefixBeforeAfter}후`) ||
//         (day_diff >= 360 && (Math.floor(day_diff / 360) === 0 ? 1 : Math.floor(day_diff / 360)) + `년${prefixBeforeAfter}후`)
//       );
//     }
//   }
// };
DateUtils.prettyDate = (time, spaceBetween = true) => {
    const timeString = (0, moment_1.default)(time).fromNow();
    return spaceBetween ? timeString : timeString.replace(" ", "");
};
// 날짜 미입력 - 최근 24시
// 시작일만 입력 - 해당날 00:00:00 - 23:59:59
// 시작 & 종료 입력 - 시작일 00:00:00 - 종료일 23:59:59
DateUtils.getPeriod = (startDate, endDate) => {
    let start = startDate;
    let end = endDate;
    if (!startDate) {
        start = (0, moment_1.default)().subtract(1, "d");
        end = (0, moment_1.default)();
    }
    else if (!endDate) {
        end = start;
    }
    return {
        start_date: (0, moment_1.default)(start).format(startDate ? "YYYY-MM-DD 00:00:00" : "YYYY-MM-DD HH:mm:ss"),
        end_date: (0, moment_1.default)(end).format(startDate ? "YYYY-MM-DD 23:59:59" : "YYYY-MM-DD HH:mm:ss"),
    };
};
DateUtils.handleLocaleChange = (locale) => {
    let relativeTime;
    switch (locale) {
        case "en":
            relativeTime = DateUtils.EN_RELATIVE_TIME_OPTIONS;
            break;
        case "ko":
            relativeTime = DateUtils.KO_RELATIVE_TIME_OPTIONS;
            break;
        case "ja":
            relativeTime = DateUtils.JA_RELATIVE_TIME_OPTIONS;
            break;
        case "zh":
            relativeTime = DateUtils.ZH_RELATIVE_TIME_OPTIONS;
            break;
    }
    moment_1.default.updateLocale(locale, {
        relativeTime
    });
};
(function (DateUtils) {
    DateUtils.KO_RELATIVE_TIME_OPTIONS = {
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
    };
    DateUtils.EN_RELATIVE_TIME_OPTIONS = {
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
    };
    DateUtils.JA_RELATIVE_TIME_OPTIONS = {
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
    };
    DateUtils.ZH_RELATIVE_TIME_OPTIONS = {
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
    };
})(DateUtils || (exports.DateUtils = DateUtils = {}));
