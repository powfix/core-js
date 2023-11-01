"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Polyfill = void 0;
const base_64_1 = require("base-64");
const base64Polyfill = () => {
    if (!global.btoa) {
        global.btoa = base_64_1.encode;
    }
    if (!global.atob) {
        global.atob = base_64_1.decode;
    }
    console.log('base64-polyfill initialized', Date.now());
};
exports.base64Polyfill = base64Polyfill;
(0, exports.base64Polyfill)();
