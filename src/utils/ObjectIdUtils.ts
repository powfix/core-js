import {UuidUtils} from "./UuidUtils";

export class ObjectIdUtils {
  public static toUuid(objectId: string, pad: 'start' | 'end' = 'start'): string {
    const result = Buffer.alloc(16);
    Buffer.from(objectId, 'hex').copy(result, pad === 'start' ? 4 : 0);
    return UuidUtils.toString(result);
  }

  public static fromUuid(uuid: string, pad?: 'start' | 'end'): string {
    const buffer = UuidUtils.toBuffer(uuid);

    const isPadEnd = buffer.subarray(buffer.length - 4).every(byte => byte === 0);
    if (isPadEnd || pad === 'end') {
      return buffer.subarray(0, buffer.length - 4).toString('hex');
    }

    const isPadStart = buffer.subarray(0, 4).every(byte => byte === 0);
    if (!isPadStart) {
      console.warn('buffer is not pad start and pad end');
    }
    return buffer.subarray(4).toString('hex');
  }
}
