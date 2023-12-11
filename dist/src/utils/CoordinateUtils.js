"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordinateUtils = void 0;
class CoordinateUtils {
    static isValidLatitude(latitude) {
        return /^-?([0-8]?[0-9]|90)(\.[0-9]{1,15})$/.test(latitude.toString());
    }
    static isValidLongitude(longitude) {
        return /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,14})$/.test(longitude.toString());
    }
    static isValidLatitudeLongitude(latitude, longitude) {
        return CoordinateUtils.isValidLatitude(latitude) && CoordinateUtils.isValidLongitude(longitude);
    }
    static isValidCoordinate(coordinate) {
        return this.isValidLatitudeLongitude(coordinate.latitude, coordinate.longitude);
    }
    static crowDistance(...coordinates) {
        if (coordinates.length <= 2) {
            const toRad = (value) => value * Math.PI / 180;
            const c1 = coordinates[0];
            const c2 = coordinates[1];
            if (!c1 || !c2) {
                return 0;
            }
            const R = 6371e3;
            const dLat = toRad(c2.latitude - c1.latitude);
            const dLon = toRad(c2.longitude - c1.longitude);
            const lat1 = toRad(c1.latitude);
            const lat2 = toRad(c2.latitude);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }
        let totalDistance = 0;
        for (let i = 0; i < coordinates.length - 1; ++i) {
            totalDistance += this.crowDistance(coordinates[i], coordinates[i + 1]);
        }
        return totalDistance;
    }
}
exports.CoordinateUtils = CoordinateUtils;
