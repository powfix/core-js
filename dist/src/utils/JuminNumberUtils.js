"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuminNumberUtils = void 0;
const between_1 = require("./global/between");
class JuminNumberUtils {
    static calculateX(juminNumber) {
        const replacedJuminNumber = juminNumber.replace(/\D/g, '');
        if (!(0, between_1.between)(replacedJuminNumber.length, 12, 13)) {
            throw new Error('Jumin number length must be 12 to 13(without dash)');
        }
        const numbers = replacedJuminNumber.split('').map(e => parseInt(e, 10));
        const sum = 2 * numbers[0] + 3 * numbers[1] + 4 * numbers[2] + 5 * numbers[3]
            + 6 * numbers[4] + 7 * numbers[5] + 8 * numbers[6] + 9 * numbers[7]
            + 2 * numbers[8] + 3 * numbers[9] + 4 * numbers[10] + 5 * numbers[11];
        return (11 - (sum % 11)) % 10;
    }
    static isValid(juminNumber) {
        const replacedJuminNumber = juminNumber.replace(/\D/g, '');
        if (replacedJuminNumber.length !== 13) {
            return false;
        }
        // 연도에 해당하는 숫자와 성별에 해당하는 숫자 비교
        const TODAY_YEAR = parseInt(new Date().getFullYear().toString().slice(-2), 10);
        const yearNum = parseInt(replacedJuminNumber.slice(0, 2), 10);
        const sexNum = replacedJuminNumber.slice(6, 7); // 대시 있는경우 7로 변경
        if (sexNum === '1' || sexNum === '2') {
            if (yearNum < TODAY_YEAR)
                return false;
        }
        else if (sexNum === '3' || sexNum === '4') {
            if (yearNum > TODAY_YEAR)
                return false;
        }
        else
            return false;
        // 월과 일에 해당하는 숫자 조건 검사 (정규식으로)
        const regex = /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{7}$/;
        if (!regex.test(replacedJuminNumber))
            return false;
        // Validation X
        const currentX = parseInt(replacedJuminNumber.slice(-1), 10);
        const calculatedX = JuminNumberUtils.calculateX(replacedJuminNumber);
        if (currentX !== calculatedX) {
            console.log('Invalid X', currentX, calculatedX);
            return false;
        }
        return true;
    }
}
exports.JuminNumberUtils = JuminNumberUtils;
