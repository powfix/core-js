import { Moment, MomentInput } from "moment";
interface PrettyDateOptions {
    enableSeconds?: boolean;
    spacePrefixBeforeAfter?: boolean;
}
export declare class DateUtils {
    static prettyDate: (time: Moment | MomentInput, options?: PrettyDateOptions) => string | false;
    static getPeriod: (startDate: any, endDate: any) => {
        start_date: string;
        end_date: string;
    };
}
export {};
