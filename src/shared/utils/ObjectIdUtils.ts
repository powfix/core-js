import {UuidUtils} from "./UuidUtils";
import {Uint8ArrayUtils} from "./Uint8ArrayUtils";

export class ObjectIdUtils {
  public static toUuid(objectId: string, pad: 'start' | 'end' = 'start'): string {
    const src = Uint8ArrayUtils.fromHex(objectId);
    if (src.length !== 12) {
      throw new Error(`objectId must be 12 bytes (24 hex), got ${src.length} bytes`);
    }

    const result = new Uint8Array(16);
    const offset = pad === 'start' ? 4 : 0;
    result.set(src, offset);
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
