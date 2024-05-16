"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidUtils = void 0;
const uuid = require('uuid');
function binaryToString(binary) {
    return Buffer.from(binary).toString('hex');
}
class UuidUtils {
    static v4() {
        return uuid.v4();
    }
    static format(uuid) {
        if (uuid.length === 32) {
            // Without dash: ca23c587d7f84c76be59f53bbc9f91f8
            return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20, 32)}`.toUpperCase();
        }
        else if (uuid.length === 36) {
            // With dash: ca23c587-d7f8-4c76-be59-f53bbc9f91f8
            return uuid.toUpperCase();
        }
        else {
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
    static toString(binary) {
        if (!binary)
            return null;
        return UuidUtils.format(binaryToString(binary));
    }
    /** (UUID: string) to (UUID: Buffer) */
    static toBuffer(uuid) {
        return Buffer.from(uuid.replace(/-/g, ''), 'hex');
    }
    static isValidUUID(uuid) {
        if (!uuid)
            return false;
        if (typeof uuid !== 'string')
            return false;
        return RegExp(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/i).test(uuid);
    }
}
exports.UuidUtils = UuidUtils;
