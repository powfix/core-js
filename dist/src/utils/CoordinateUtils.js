"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordinateUtils = void 0;
class CoordinateUtils {
    static isValidLatitudeLongitude(latitude, longitude) {
        return CoordinateUtils.isValidLatitude(latitude) && CoordinateUtils.isValidLongitude(longitude);
    }
    static isValidLatitude(latitude) {
        return /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(latitude.toString());
    }
    static isValidLongitude(longitude) {
        return /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/.test(longitude.toString());
    }
    static crowDistance(latitude1, longitude1, latitude2, longitude2) {
        const toRad = (value) => value * Math.PI / 180;
        const R = 6371e3;
        const dLat = toRad(latitude2 - latitude1);
        const dLon = toRad(longitude2 - longitude1);
        const lat1 = toRad(latitude1);
        const lat2 = toRad(latitude2);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
exports.CoordinateUtils = CoordinateUtils;
