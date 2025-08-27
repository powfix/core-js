import {btoa} from "./btoa";
import {atob} from "./atob";

export function encodeBase64(str: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary: string = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function decodeBase64(base64: string) {
  const binary = atob(base64);
  const binaryLength = binary.length;
  const bytes = new Uint8Array(binaryLength);
  for (let i = 0; i < binaryLength; ++i) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
}
