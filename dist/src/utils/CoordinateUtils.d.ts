import { Coordinate } from "../interfaces/Coordinate";
export declare class CoordinateUtils {
    static isValidLatitude(latitude: Coordinate['latitude'] | string): boolean;
    static isValidLongitude(longitude: Coordinate['longitude'] | string): boolean;
    static isValidLatitudeLongitude(latitude: Coordinate['latitude'] | string, longitude: Coordinate['longitude'] | string): boolean;
    static isValidCoordinate(coordinate: Coordinate): boolean;
    static crowDistance(...coordinates: Coordinate[]): number;
}
