"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point3Utils = void 0;
class Point3Utils {
    static distance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}
exports.Point3Utils = Point3Utils;
