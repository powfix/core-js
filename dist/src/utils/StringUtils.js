"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = void 0;
class StringUtils {
    static numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    static getByte(s) {
        const getByteLength = (decimal) => {
            const LINE_FEED = 10;
            return (decimal >> 7) || (LINE_FEED === decimal) ? 2 : 1;
        };
        return s
            .split('')
            .map((s) => s.charCodeAt(0))
            .reduce((prev, unicodeDecimalValue) => prev + getByteLength(unicodeDecimalValue), 0);
    }
}
exports.StringUtils = StringUtils;
