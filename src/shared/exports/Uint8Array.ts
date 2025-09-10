import {Uint8ArrayUtils} from "../utils";

declare global {
  interface Uint8ArrayConstructor {
    fromHex(hex: string): Uint8Array;
    toHex(bytes: Uint8Array): string;
  }
}

if (!Uint8Array?.fromHex) {
  Uint8Array.fromHex = Uint8ArrayUtils.fromHex;
}

if (!Uint8Array?.toHex) {
  Uint8Array.toHex = Uint8ArrayUtils.toHex;
}

export {};
