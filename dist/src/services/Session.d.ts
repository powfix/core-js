import {ApisauceInstance} from "apisauce";

export interface SessionOptions {
    api: ApisauceInstance;
    storageProvider: StorageProvider;
}
export interface StorageProvider {
    set: (key: string, value: string) => Promise<void>;
    get: (key: string) => Promise<string | null>;
    remove: (key: string) => Promise<void>;
    clear?: () => Promise<void>;
}
export declare class Session {
    private api;
    private storageProvider;
    constructor(options: SessionOptions);
    hasAuthorization: () => Promise<boolean>;
    getAuthorization: () => Promise<string | null>;
    setAuthorization: (authorization: string) => Promise<void>;
    removeAuthorization: () => Promise<void>;
}
export declare namespace Session {
    enum STORAGE_KEY {
        SESSION_AUTHORIZATION = "SESSION_AUTHORIZATION"
    }
}
