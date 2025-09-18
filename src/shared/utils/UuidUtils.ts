import * as uuid from "uuid";
import {Uint8ArrayUtils} from "./Uint8ArrayUtils";

export class UuidUtils {
  /**
   * Generate a random UUID v4 string.
   *
   * @deprecated This method is deprecated and will be removed in future versions.
   * Please use the `UUID` class from the `@powfix/uuid` package instead:
   *
   * ```ts
   * import { UUID } from "@powfix/uuid";
   * UUID.v4().toString();
   * ```
   *
   * @returns {string} A randomly generated UUID v4 string.
   */
	static v4(): string {
		return uuid.v4();
	}

  /**
   * Format a UUID string with or without dashes into the canonical
   * lowercase dashed UUID string representation.
   *
   * @deprecated This method is deprecated and will be removed in future versions.
   * Please use the `UUID` class from the `@powfix/uuid` package instead:
   *
   * ```ts
   * import { UUID } from "@powfix/uuid";
   * UUID.fromString(str).toString();
   * ```
   *
   * @param uuid A UUID string (32 characters without dashes, or 36 characters with dashes).
   * @returns {string} Canonical UUID string in lowercase with dashes.
   */
	static format(uuid: string) {
		if (uuid.length === 32) {
			// Without dash: ca23c587d7f84c76be59f53bbc9f91f8
			return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20, 32)}`.toLowerCase();
		} else if (uuid.length === 36) {
			// With dash: ca23c587-d7f8-4c76-be59-f53bbc9f91f8
			return uuid.toLowerCase();
		} else {
			// Unexpected uuid
			console.warn('Unexpected uuid length', uuid);
			return uuid;
		}
	}

  /**
   * Convert a UUID Buffer/Uint8Array into a string representation.
   *
   * @deprecated This method is deprecated and will be removed in future versions.
   * Please use the `UUID` class from the `@powfix/uuid` package instead:
   *
   * ```ts
   * import { UUID } from "@powfix/uuid";
   * UUID.fromBuffer(binary).toString();
   * ```
   *
   * @param binary A UUID in Buffer or Uint8Array form.
   * @returns {string|null} The UUID string, or null if the input is not provided.
   */
	static toString(binary: Uint8Array): string
	static toString(binary?: Uint8Array): string | null {
		if (!binary) return null;
		return UuidUtils.format(Uint8ArrayUtils.toHex(binary));
	}

  /**
   * Convert a UUID string to a Buffer.
   *
   * @deprecated This method is deprecated and will be removed in future versions.
   * Please use the `UUID` class from the `@powfix/uuid` package instead:
   *
   * ```ts
   * import { UUID } from "@powfix/uuid";
   * UUID.fromString(uuid).toBuffer();
   * ```
   */
	static toBuffer(uuid: string): Buffer
	static toBuffer(uuid: string | null | undefined): Buffer | null
	static toBuffer(uuid: string | null | undefined): Buffer | null {
		if (!uuid) {return null;}
		return Buffer.from(uuid.replace(/-/g, ''), 'hex');
	}

  /**
   * Check is provided uuid string is valid UUID
   *
   * @deprecated This method is deprecated and will be removed in future versions.
   * Please use the `UUID` class from the `@powfix/uuid` package instead:
   *
   * ```ts
   * import { UUID } from "@powfix/uuid";
   * UUID.isValidString(uuid);
   * ```
   */
	static isValidUUID(uuid: string): boolean {
		if (!uuid) return false;
		if (typeof uuid !== 'string') return false;
		return RegExp(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/i).test(uuid);
	}
}
