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
/* eslint-disable no-mixed-operators */
DateUtils.prettyDate = (time, options) => {
    const now = (0, moment_1.default)();
    const date = moment_1.default.isMoment(time) ? time : (0, moment_1.default)(time);
    const diff = now.diff(date, "seconds");
    const day_diff = now.diff(date, "days");
    const prefixBeforeAfter = (options === null || options === void 0 ? void 0 : options.spacePrefixBeforeAfter) ? ' ' : '';
    if (day_diff === 0) {
        if (diff >= 0) {
            return ((diff < 60 && ((options === null || options === void 0 ? void 0 : options.enableSeconds) ? `${diff}초${prefixBeforeAfter}전` : `방금${prefixBeforeAfter}전`)) ||
                (diff < 120 && `1분${prefixBeforeAfter}전`) ||
                (diff < 3600 && Math.floor(diff / 60) + `분${prefixBeforeAfter}전`) ||
                (diff < 7200 && `1시간${prefixBeforeAfter}전`) ||
                (diff < 86400 && Math.floor(diff / 3600) + `시간${prefixBeforeAfter}전`));
        }
        else {
            return ((diff > -60 && `잠시${prefixBeforeAfter}후`) ||
                (diff > -120 && `1분${prefixBeforeAfter}후`) ||
                (diff > -3600 && Math.floor(diff / 60) + `분${prefixBeforeAfter}후`) ||
                (diff > -7200 && `1시간${prefixBeforeAfter}후`) ||
                (diff > -86400 && Math.floor(diff / 3600) + `시간${prefixBeforeAfter}후`));
        }
    }
    else {
        if (day_diff === 1)
            return `어제`;
        if (day_diff === -1)
            return `내일`;
        if (day_diff >= 0) {
            return ((day_diff < 7 && day_diff + `일${prefixBeforeAfter}전`) ||
                (day_diff < 31 && Math.floor(day_diff / 7) + `주${prefixBeforeAfter}전`) ||
                (day_diff < 360 && Math.floor(day_diff / 30) + `개월${prefixBeforeAfter}전`) ||
                (day_diff >= 360 && (Math.floor(day_diff / 360) === 0 ? 1 : Math.floor(day_diff / 360)) + `년${prefixBeforeAfter}전`));
        }
        else {
            return ((day_diff < 7 && day_diff + `일${prefixBeforeAfter}후`) ||
                (day_diff < 31 && Math.floor(day_diff / 7) + `주${prefixBeforeAfter}후`) ||
                (day_diff < 360 && Math.floor(day_diff / 30) + `개월${prefixBeforeAfter}후`) ||
                (day_diff >= 360 && (Math.floor(day_diff / 360) === 0 ? 1 : Math.floor(day_diff / 360)) + `년${prefixBeforeAfter}후`));
        }
    }
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
