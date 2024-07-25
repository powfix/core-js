import { MomentInput, RelativeTimeSpec } from "moment";
export declare class DateUtils {
    static relativeDate: (input: MomentInput, from?: MomentInput) => string;
    static setLocale: (language: DateUtils.Locale) => void;
    private static getRelativeTimeSpec;
}
export declare namespace DateUtils {
    type Locale = keyof typeof DateUtils.relativeTimeSpecs | string;
    const relativeTimeSpecs: {
        [key: string]: RelativeTimeSpec;
    };
}
