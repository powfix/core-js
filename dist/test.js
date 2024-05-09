"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
const moment_1 = __importDefault(require("moment"));
const nowForKO = (0, moment_1.default)();
setInterval(() => {
    console.log('============');
    browser_1.DateUtils.setLocale('ko');
    console.log(browser_1.DateUtils.relativeDate(nowForKO));
    browser_1.DateUtils.setLocale('en');
    console.log(browser_1.DateUtils.relativeDate(nowForKO));
    browser_1.DateUtils.setLocale('ja');
    console.log(browser_1.DateUtils.relativeDate(nowForKO));
    browser_1.DateUtils.setLocale('zh');
    console.log(browser_1.DateUtils.relativeDate(nowForKO));
    browser_1.DateUtils.setLocale('ko');
    console.log(browser_1.DateUtils.relativeDate((0, moment_1.default)('37821789371289739')));
}, 1000);
