import {AxiosInstance} from "axios";

export interface SessionOptions {
    api: AxiosInstance;
    storageProvider: StorageProvider;
}
export interface StorageProvider {
    key?: () => string;
    set: (key: string, value: string) => void;
    get: (key: string) => string | null;
    remove: (key: string) => void;
    clear?: () => void;
}
export declare class Session {
    protected api: AxiosInstance;
    protected storageProvider: StorageProvider;
    constructor(options: SessionOptions);
    private getKey;
    hasAuthorization(): boolean;
    getAuthorization(): string | null;
    setAuthorization(authorization?: string | null): void;
    removeAuthorization(): void;
}
export declare namespace Session {
    enum STORAGE_KEY {
        SESSION_AUTHORIZATION = "SESSION_AUTHORIZATION"
    }
}
