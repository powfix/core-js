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
StringUtils.levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(track[j][i - 1] + 1, // deletion
            track[j - 1][i] + 1, // insertion
            track[j - 1][i - 1] + indicator);
        }
    }
    return track[str2.length][str1.length];
};
