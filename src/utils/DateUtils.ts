import moment, {Moment, MomentInput} from "moment";

interface PrettyDateOptions {
  enableSeconds?: boolean;              // 초단위 표시 여부

  spacePrefixBeforeAfter?: boolean;     // 전/후 앞 띄워쓰기 유무
}

export class DateUtils {
  /* eslint-disable no-mixed-operators */
  static prettyDate = (time: Moment | MomentInput, options?: PrettyDateOptions) => {
    const now = moment();
    const date = moment.isMoment(time) ? time : moment(time);

    const diff = now.diff(date, "seconds");
    const day_diff = now.diff(date, "days");

    const prefixBeforeAfter: string = options?.spacePrefixBeforeAfter ? ' ' : '';

    if (day_diff === 0) {
      if (diff >= 0) {
        return (
          (diff < 60 && (options?.enableSeconds ? `${diff}초${prefixBeforeAfter}전` : `방금${prefixBeforeAfter}전`)) ||
          (diff < 120 && `1분${prefixBeforeAfter}전`) ||
          (diff < 3600 && Math.floor(diff / 60) + `분${prefixBeforeAfter}전`) ||
          (diff < 7200 && `1시간${prefixBeforeAfter}전`) ||
          (diff < 86400 && Math.floor(diff / 3600) + `시간${prefixBeforeAfter}전`)
        );
      } else {
        return (
          (diff > -60 && `잠시${prefixBeforeAfter}후`) ||
          (diff > -120 && `1분${prefixBeforeAfter}후`) ||
          (diff > -3600 && Math.floor(diff / 60) + `분${prefixBeforeAfter}후`) ||
          (diff > -7200 && `1시간${prefixBeforeAfter}후`) ||
          (diff > -86400 && Math.floor(diff / 3600) + `시간${prefixBeforeAfter}후`)
        );
      }
    } else {
      if (day_diff === 1) return `어제`;
      if (day_diff === -1) return `내일`;

      if (day_diff >= 0) {
        return (
          (day_diff < 7 && day_diff + `일${prefixBeforeAfter}전`) ||
          (day_diff < 31 && Math.floor(day_diff / 7) + `주${prefixBeforeAfter}전`) ||
          (day_diff < 360 && Math.floor(day_diff / 30) + `개월${prefixBeforeAfter}전`) ||
          (day_diff >= 360 && (Math.floor(day_diff / 360) === 0 ? 1 : Math.floor(day_diff / 360)) + `년${prefixBeforeAfter}전`)
        );
      } else {
        return (
          (day_diff < 7 && day_diff + `일${prefixBeforeAfter}후`) ||
          (day_diff < 31 && Math.floor(day_diff / 7) + `주${prefixBeforeAfter}후`) ||
          (day_diff < 360 && Math.floor(day_diff / 30) + `개월${prefixBeforeAfter}후`) ||
          (day_diff >= 360 && (Math.floor(day_diff / 360) === 0 ? 1 : Math.floor(day_diff / 360)) + `년${prefixBeforeAfter}후`)
        );
      }
    }
  };

  // 날짜 미입력 - 최근 24시
  // 시작일만 입력 - 해당날 00:00:00 - 23:59:59
  // 시작 & 종료 입력 - 시작일 00:00:00 - 종료일 23:59:59
  static getPeriod = (startDate: any, endDate: any) => {
    let start = startDate;
    let end = endDate;

    if (!startDate) {
      start = moment().subtract(1, "d");
      end = moment();
    } else if (!endDate) {
      end = start;
    }

    return {
      start_date: moment(start).format(startDate ? "YYYY-MM-DD 00:00:00" : "YYYY-MM-DD HH:mm:ss"),
      end_date: moment(end).format(startDate ? "YYYY-MM-DD 23:59:59" : "YYYY-MM-DD HH:mm:ss"),
    };
  };
}
