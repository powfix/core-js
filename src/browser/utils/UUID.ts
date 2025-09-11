import {Uint8ArrayUtils} from "../../shared/utils/Uint8ArrayUtils";

export class UUID {
  private static BYTE_LENGTH: number = 16;
  private static HEX_STR_LENGTH: number = 32;

  private static formatHex(hex: string): string {
    if (hex.length !== UUID.HEX_STR_LENGTH) {
      throw new Error(`hex length should be ${UUID.HEX_STR_LENGTH}`);
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
    if (hex.length !== UUID.HEX_STR_LENGTH) {
      throw new Error('Invalid UUID string');
    }
    return Uint8ArrayUtils.fromHex(hex);
  }

  public static fromString(str: string): UUID {
    return new UUID(str);
  }

  private static parseBytes(bytes: ArrayBufferView): Uint8Array {
    if (bytes instanceof Uint8Array) {
      return new Uint8Array(bytes);
    } else {
      return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    }
  }

  public static fromBytes(bytes: ArrayBufferView): UUID {
    return new UUID(UUID.parseBytes(bytes));
  }

  public static nil(): UUID {
    return new UUID((new Uint8Array(UUID.BYTE_LENGTH)).fill(0x00));
  }

  public static max(): UUID {
    return new UUID((new Uint8Array(UUID.BYTE_LENGTH)).fill(0xFF));
  }

  public static equals(...uuids: UUID[]): boolean {
    const n = uuids.length;
    if (n <= 1) return true;

    const ref = uuids[0].bytes;

    for (let i = 1; i < n; ++i) {
      const b = uuids[i].bytes;
      for (let j = 0; j < UUID.BYTE_LENGTH; ++j) {
        if (ref[j] !== b[j]) return false;
      }
    }
    return true;
  }

  public static compare(uuid1: UUID, uuid2: UUID): number {
    const a = uuid1.bytes;
    const b = uuid2.bytes;
    for (let i = 0; i < UUID.BYTE_LENGTH; i++) {
      if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
    }
    return 0;
  }

  protected readonly bytes: Uint8Array;

  // for cache
  private _str?: string;
  private _hex?: string;

  public constructor(input: string | ArrayBufferView) {
    if (input == null) {
      throw new Error('Input cannot be null');
    }

    if (typeof input === 'string') {
      this.bytes = UUID.parseString(input);
    } else if (ArrayBuffer.isView(input)) {
      this.bytes = UUID.parseBytes(input);
    } else {
      throw new Error("Expected string or ArrayBufferView")
    }

    if (this.bytes.byteLength !== UUID.BYTE_LENGTH) {
      throw new Error(`UUID must be ${UUID.BYTE_LENGTH} bytes`);
    }
  }

  public equals(...uuids: UUID[]): boolean {
    return UUID.equals(this, ...uuids);
  }

  public compare(other: UUID): number {
    return UUID.compare(this, other);
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
