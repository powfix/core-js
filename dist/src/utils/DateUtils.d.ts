import { MomentInput, RelativeTimeSpec } from "moment";
export declare class DateUtils {
    static relativeDate: (input: MomentInput, from?: MomentInput) => string;
    static setLocale: (language: DateUtils.Locale) => void;
    private static getRelativeTimeSpec;
}
export declare namespace DateUtils {
    type Locale = string;
    const relativeTimeSpecs: {
        [key: Locale]: RelativeTimeSpec;
    };
}
