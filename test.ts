import {DateUtils} from "./browser";
import moment from "moment";

const nowForKO = moment();

setInterval(() => {
  console.log('============');

  DateUtils.setLocale('ko');
  console.log(DateUtils.relativeDate(nowForKO));

  DateUtils.setLocale('en');
  console.log(DateUtils.relativeDate(nowForKO));

  DateUtils.setLocale('ja');
  console.log(DateUtils.relativeDate(nowForKO));

  DateUtils.setLocale('zh');
  console.log(DateUtils.relativeDate(nowForKO));

  DateUtils.setLocale('ko');
  console.log(DateUtils.relativeDate(moment('37821789371289739')));
}, 1000);
