export class CoordinateUtils {
  public static isValidLatitudeLongitude(latitude: number | string, longitude: number | string) {
    return CoordinateUtils.isValidLatitude(latitude) && CoordinateUtils.isValidLongitude(longitude);
  }

  public static isValidLatitude(latitude: number | string) {
    return /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(latitude.toString());
  }

  public static isValidLongitude(longitude: number | string) {
    return /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/.test(longitude.toString());
  }

  public static crowDistance(latitude1: number, longitude1: number, latitude2: number, longitude2: number): number {
    const toRad = (value: number) => value * Math.PI / 180;

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
