"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBoolean = void 0;
function parseBoolean(value, defaultValue) {
    if (value === undefined || value === null)
        return defaultValue;
    return (value === 'true' || value === true) || (value === 1 || value === '1');
}
exports.parseBoolean = parseBoolean;
