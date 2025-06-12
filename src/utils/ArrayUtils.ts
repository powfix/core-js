import {castArray} from "./global/index.js";

export class ArrayUtils {
  static castArray<T>(value: T | T[]): T[] {
    return castArray(value);
  }

  /**
   * 객체를 요소로 가지는 배열에서 가장 큰 값(Property)를 가지는 객체를 반환한다
   * @param e 객체 배열
   * @param key 값을 비교할 Property 키
   */
  static getGreatestObject(e: any[], key: string) {
    return e.reduce((prev, current) => (
      (prev[key] > current[key] ? prev : current)
    ));
  }

  static removeDuplicate<T>(arr: T[]): T[] {
    return [...new Set(arr)]
  }

  static removeObjectDuplicate(arr: any[], key: string) {
    return arr.filter((v, i, self) => (
      i === self.findIndex(e => (
        e[key] === v[key]
      ))
    ))
  }

  public static allValuesEqual<T>(...values: T[]): boolean {
    if (values.length === 0) {return true;}
    return values.every((value) => value === values[0]);
  }
}
