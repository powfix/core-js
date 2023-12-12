"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberUtils = void 0;
class NumberUtils {
    static formatWithThousandsSeparator(value, separator = ',') {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
    static formatBigNumber(value, precision = 2) {
        const map = [
            { suffix: 'Qi', threshold: 1e18 },
            { suffix: 'Q', threshold: 1e15 },
            { suffix: 'T', threshold: 1e12 },
            { suffix: 'B', threshold: 1e9 },
            { suffix: 'M', threshold: 1e6 },
            { suffix: 'K', threshold: 1e3 },
            { suffix: '', threshold: 1 },
        ];
        const found = map.find(e => Math.abs(value) >= e.threshold);
        if (found) {
            return Number((value / found.threshold).toFixed(precision)) + found.suffix;
        }
        return value.toString();
    }
}
exports.NumberUtils = NumberUtils;
