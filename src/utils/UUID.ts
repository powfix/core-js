import {Uint8ArrayUtils} from "./Uint8ArrayUtils";

export class UUID {
  private static formatHex(hex: string): string {
    if (hex.length !== 32) {
      throw new Error('hex length should be 32');
    }
    return hex.slice(0, 8) + '-' +
      hex.slice(8, 12) + '-' +
      hex.slice(12, 16) + '-' +
      hex.slice(16, 20) + '-' +
      hex.slice(20);
  }

  private static stripHyphens(str: string): string {
    return str.replace(/-/g, "");
  }

  private static parseString(str: string): Uint8Array {
    const hex = UUID.stripHyphens(str);
    if (hex.length !== 32) {
      throw new Error('Invalid UUID string');
    }
    return Uint8ArrayUtils.fromHex(hex);
  }

  public static fromString(str: string): UUID {
    return new UUID(str);
  }

  public static nil(): UUID {
    return new UUID(new Uint8Array(16));
  }

  private readonly bytes: Uint8Array;

  // for cache
  private _str?: string;
  private _hex?: string;

  public constructor(input: string | ArrayBufferView) {
    if (input == null) {
      throw new Error('Input cannot be null');
    }

    if (typeof input === 'string') {
      this.bytes = UUID.parseString(input);
    } else {
      if (input instanceof Uint8Array) {
        this.bytes = new Uint8Array(input);
      } else {
        this.bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
      }
    }

    if (this.bytes.byteLength !== 16) {
      throw new Error("UUID must be 16 bytes");
    }
  }

  public equals(other: UUID): boolean {
    const a = this.bytes, b = other.bytes;
    let v = 0;
    for (let i = 0; i < 16; i++) v |= a[i] ^ b[i];
    return v === 0;
  }

  public compare(other: UUID): number {
    const a = this.bytes, b = other.bytes;
    for (let i = 0; i < 16; i++) {
      if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
    }
    return 0;
  }

  public toString(): string {
    if (this._str != null) {
      return this._str;
    }
    const hex = this.toHex();
    return UUID.formatHex(hex);
  }

  public toHex(): string {
    if (this._hex != null) {
      return this._hex;
    }
    return Uint8ArrayUtils.toHex(this.bytes);
  }

  public toBytes(): Uint8Array {
    return new Uint8Array(this.bytes);
  }

  public toJSON(): string {
    return this.toString();
  }
}
