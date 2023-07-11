/// <reference types="node" />
import EventEmitter from 'events';
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
    private authorization;
    private api;
    private storageProvider;
    private emitter;
    on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter;
    off: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter;
    private emit;
    constructor(options: SessionOptions);
    getAuthorization: () => string | null;
    private setAuthorization;
    hasAuthorization: () => boolean;
    setSession: (token: string) => Promise<void>;
    check: () => Promise<void>;
    update: () => Promise<void>;
    /**
     * 서버에서 토큰을 만료처리하고 로컬 API 인스턴스의 헤더에서 토큰을 제거한다.
     * 서버에서 토큰 만료에 실패해도 성공으로 반환될 수 있다.
     */
    deleteSession: () => Promise<void>;
}
export declare namespace Session {
    enum STORAGE_KEY {
        SESSION_AUTHORIZATION = "SESSION_AUTHORIZATION"
    }
}
