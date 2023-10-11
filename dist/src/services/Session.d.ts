import { AxiosInstance } from "axios";
export interface SessionOptions {
    api: AxiosInstance;
    storageProvider: StorageProvider;
}
export interface StorageProvider {
    key?: () => string;
    set: (key: string, value: string) => Promise<void> | void;
    get: (key: string) => Promise<string | null> | (string | null);
    remove: (key: string) => Promise<void> | void;
    clear?: () => Promise<void> | void;
}
export declare class Session {
    protected api: AxiosInstance;
    protected storageProvider: StorageProvider;
    constructor(options: SessionOptions);
    private getKey;
    hasAuthorization(): Promise<boolean>;
    getAuthorization(): Promise<string | null>;
    setAuthorization(authorization?: string | null): Promise<void>;
    removeAuthorization(): Promise<void>;
}
export declare namespace Session {
    enum STORAGE_KEY {
        SESSION_AUTHORIZATION = "SESSION_AUTHORIZATION"
    }
}
