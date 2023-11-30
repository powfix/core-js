import {Point3} from "../interfaces/Point3";

export class Point3Utils {
  static distance(p1: Point3, p2: Point3): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
  }
}
