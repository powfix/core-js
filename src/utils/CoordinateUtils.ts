import {Coordinate} from "../interfaces/Coordinate";

export class CoordinateUtils {
  public static isValidLatitude(latitude: Coordinate['latitude'] | string) {
    return /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(latitude.toString());
  }

  public static isValidLongitude(longitude: Coordinate['longitude'] | string) {
    return /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/.test(longitude.toString());
  }

  public static isValidLatitudeLongitude(latitude: Coordinate['latitude'] | string, longitude: Coordinate['longitude'] | string) {
    return CoordinateUtils.isValidLatitude(latitude) && CoordinateUtils.isValidLongitude(longitude);
  }

  public static isValidCoordinate(coordinate: Coordinate): boolean {
    return this.isValidLatitudeLongitude(coordinate.latitude, coordinate.longitude);
  }

  public static crowDistance(c1: Coordinate, c2: Coordinate): number {
    const toRad = (value: number) => value * Math.PI / 180;

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
}
