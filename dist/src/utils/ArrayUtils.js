"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayUtils = void 0;
class ArrayUtils {
    /**
     * 객체를 요소로 가지는 배열에서 가장 큰 값(Property)를 가지는 객체를 반환한다
     * @param e 객체 배열
     * @param key 값을 비교할 Property 키
     */
    static getGreatestObject(e, key) {
        return e.reduce((prev, current) => ((prev[key] > current[key] ? prev : current)));
    }
    static removeDuplicate(arr) {
        return [...new Set(arr)];
    }
    static removeObjectDuplicate(arr, key) {
        return arr.filter((v, i, self) => (i === self.findIndex(e => (e[key] === v[key]))));
    }
}
exports.ArrayUtils = ArrayUtils;
