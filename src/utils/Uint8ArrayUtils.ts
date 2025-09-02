export class Uint8ArrayUtils {
  public static fromHex(hex: string): Uint8Array {
    return Uint8Array.from(hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? []);
  }

  public static toHex(bytes: Uint8Array): string {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  }
}
