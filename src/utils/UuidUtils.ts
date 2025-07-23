import * as uuid from "uuid";

function binaryToString(binary: Buffer): string {
	return Buffer.from(binary).toString('hex');
}

export class UuidUtils {
	static v4(): string {
		return uuid.v4();
	}

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
	 * (UUID: Buffer) to (UUID: string)
	 * @param binary UUID
	 * @returns {string|null} When binary not exists return null
	 */
	static toString(binary: Buffer): string
	static toString(binary?: Buffer): string | null {
		if (!binary) return null;
		return UuidUtils.format(binaryToString(binary));
	}

	/** (UUID: string) to (UUID: Buffer) */
	static toBuffer(uuid: string): Buffer
	static toBuffer(uuid: string | null | undefined): Buffer | null
	static toBuffer(uuid: string | null | undefined): Buffer | null {
		if (!uuid) {return null;}
		return Buffer.from(uuid.replace(/-/g, ''), 'hex');
	}

	static isValidUUID(uuid: string): boolean {
		if (!uuid) return false;
		if (typeof uuid !== 'string') return false;
		return RegExp(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/i).test(uuid);
	}
}
