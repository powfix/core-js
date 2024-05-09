import { Moment, MomentInput, RelativeTimeSpec } from "moment";
export declare class DateUtils {
    static prettyDate: (time: MomentInput | Moment, spaceBetween?: boolean) => string;
    static getPeriod: (startDate: any, endDate: any) => {
        start_date: string;
        end_date: string;
    };
    static handleLocaleChange: (locale: DateUtils.DateUtilsLocales) => void;
}
export declare namespace DateUtils {
    type DateUtilsLocales = "ko" | "ja" | "zh" | "en";
    const KO_RELATIVE_TIME_OPTIONS: RelativeTimeSpec;
    const EN_RELATIVE_TIME_OPTIONS: RelativeTimeSpec;
    const JA_RELATIVE_TIME_OPTIONS: RelativeTimeSpec;
    const ZH_RELATIVE_TIME_OPTIONS: RelativeTimeSpec;
}
