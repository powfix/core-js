import {Uint8ArrayUtils} from "../../shared";

export class UUID {
  private static REGEX_HEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}[1-5][0-9a-fA-F]{3}[89abAB][0-9a-fA-F]{3}[0-9a-fA-F]{12}$/;
  private static REGEX_RFC4122 = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  private static BYTE_LENGTH: number = 16;
  private static STR_LENGTH: number = 36;
  private static HEX_STR_LENGTH: number = 32;

  public static isValidHex(hex: string): boolean {
    if (typeof hex !== 'string') {
      return false;
    }
    return UUID.REGEX_HEX.test(hex);
  }

  public static isValidString(str: string): boolean {
    if (typeof str !== 'string') {
      return false;
    }
    return UUID.REGEX_RFC4122.test(str);
  }

  public static isValidBytes(bytes: ArrayBufferView): boolean {
    return bytes.byteLength === UUID.BYTE_LENGTH;
  }

  public static isValid(input: string | ArrayBufferView): boolean {
    if (typeof input === 'string') {
      const length: number = input.length;
      switch (length) {
        case UUID.STR_LENGTH: {
          // RFC 4122 uuid(string)
          // 9e472052-a654-4693-9a8b-3ce57ada3d6c
          return UUID.isValidString(input);
        }
        case UUID.HEX_STR_LENGTH: {
          // RFC 4122 uuid(string) without hyphens
          // 9e472052a65446939a8b3ce57ada3d6c
          return UUID.isValidHex(input);
        }
        default: {
          return false;
        }
      }
    } else if (ArrayBuffer.isView(input)) {
      return UUID.isValidBytes(input);
    } else {
      return false;
    }
  }

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

  private static parseHex(hex: string): Uint8Array {
    if (hex.length !== UUID.HEX_STR_LENGTH) {
      throw new Error(`Invalid hex string, length should be ${UUID.HEX_STR_LENGTH}`);
    }
    return Uint8ArrayUtils.fromHex(hex);
  }

  public static fromHex(hex: string): UUID {
    return new UUID(UUID.parseHex(hex));
  }

  private static parseString(str: string): Uint8Array {
    if (str.length !== UUID.STR_LENGTH) {
      throw new Error(`Invalid UUID string, invalid character length should be ${UUID.STR_LENGTH}`);
    }

    if (!UUID.isValid(str)) {
      throw new Error('Invalid UUID string, should be RFC 4122 format');
    }

    const hex = UUID.stripHyphens(str);
    if (hex.length !== UUID.HEX_STR_LENGTH) {
      throw new Error('Invalid UUID string, invalid character length after strip hyphens');
    }
    return Uint8ArrayUtils.fromHex(hex);
  }

  public static fromString(str: string): UUID {
    return new UUID(UUID.parseString(str));
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

  private static parse(input: string | ArrayBufferView): Uint8Array {
    if (typeof input === 'string') {
      const length: number = input.length;
      switch (length) {
        case UUID.STR_LENGTH: {
          // RFC 4122 uuid(string)
          // 9e472052-a654-4693-9a8b-3ce57ada3d6c
          return UUID.parseString(input);
        }
        case UUID.HEX_STR_LENGTH: {
          // RFC 4122 uuid(string) without hyphens
          // 9e472052a65446939a8b3ce57ada3d6c
          return UUID.parseHex(input);
        }
        default: {
          throw new Error(`Invalid input string, length should be ${UUID.STR_LENGTH} or ${UUID.HEX_STR_LENGTH}`);
        }
      }
    } else if (ArrayBuffer.isView(input)) {
      return UUID.parseBytes(input);
    } else {
      throw new Error("Invalid input, Expected string or ArrayBufferView");
    }
  }

  public static from(input: string | ArrayBufferView): UUID {
    return new UUID(UUID.parse(input));
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
    this.bytes = UUID.parse(input);

    // Validate bytes length
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
