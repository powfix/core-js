export declare class ArrayUtils {
    /**
     * 객체를 요소로 가지는 배열에서 가장 큰 값(Property)를 가지는 객체를 반환한다
     * @param e 객체 배열
     * @param key 값을 비교할 Property 키
     */
    static getGreatestObject(e: any[], key: string): any;
    static removeDuplicate<T>(arr: T[]): T[];
    static removeObjectDuplicate(arr: any[], key: string): any[];
}
