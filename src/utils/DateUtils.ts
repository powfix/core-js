import moment from "moment";

export class DateUtils {
  /* eslint-disable no-mixed-operators */
  static prettyDate = (time: any) => {
    const now = moment();
    const date = moment.isMoment(time) ? time : moment(time);

    const diff = now.diff(date, "seconds");
    const day_diff = now.diff(date, "days");

    if (day_diff === 0) {
      if (diff >= 0) {
        return (
          (diff < 60 && "방금전") ||
          (diff < 120 && "1분전") ||
          (diff < 3600 && Math.floor(diff / 60) + "분전") ||
          (diff < 7200 && "1시간전") ||
          (diff < 86400 && Math.floor(diff / 3600) + "시간전")
        );
      } else {
        return (
          (diff > -60 && "잠시후") ||
          (diff > -120 && "1분후") ||
          (diff > -3600 && Math.floor(diff / 60) + "분후") ||
          (diff > -7200 && "1시간후") ||
          (diff > -86400 && Math.floor(diff / 3600) + "시간후")
        );
      }
    } else {
      if (day_diff === 1) return "어제";
      if (day_diff === -1) return "내일";

      if (day_diff >= 0) {
        return (
          (day_diff < 7 && day_diff + "일전") ||
          (day_diff < 31 && Math.floor(day_diff / 7) + "주전") ||
          (day_diff < 360 && Math.floor(day_diff / 30) + "개월 전") ||
          (day_diff >= 360 && (Math.floor(day_diff / 360) === 0 ? 1 : Math.floor(day_diff / 360)) + "년 전")
        );
      } else {
        return (
          (day_diff < 7 && day_diff + "일후") ||
          (day_diff < 31 && Math.floor(day_diff / 7) + "주후") ||
          (day_diff < 360 && Math.floor(day_diff / 30) + "개월 후") ||
          (day_diff >= 360 && (Math.floor(day_diff / 360) === 0 ? 1 : Math.floor(day_diff / 360)) + "년 후")
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
