/// <reference types="node" />
export declare class UuidUtils {
    static v4(): string;
    static format(uuid: string): string;
    /**
     * (UUID: Buffer) to (UUID: string)
     * @param binary UUID
     * @returns {string|null} When binary not exists return null
     */
    static toString(binary?: Buffer): string | null;
    /** (UUID: string) to (UUID: Buffer) */
    static toBuffer(uuid: string): Buffer;
    static isValidUUID(uuid: string): boolean;
}
