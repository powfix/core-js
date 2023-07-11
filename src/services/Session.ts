import EventEmitter from 'events';
import {ApisauceInstance} from "apisauce";
import jwt from 'jsonwebtoken';

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

const logWithTs = (...p: any) => {
  console.log(Date.now(), ...p);
}

export class Session {
  private authorization: string | null = null;

  // Service parameters
  private api: ApisauceInstance;
  private storageProvider: StorageProvider;

  // Emitter
  private emitter = new EventEmitter({});
  public on = this.emitter.on;
  public off = this.emitter.off;
  private emit = this.emitter.emit;

  public constructor(options: SessionOptions) {
    console.log("Session():initialized at", Date.now());

    // Init service parameters
    this.api = options.api;
    this.storageProvider = options.storageProvider;
  }

  public getAuthorization = (): string | null => this.authorization;

  private setAuthorization = (authorization: string | null) => {
    if (authorization) {
      this.authorization = authorization.replace(/^Bearer\s+/, '');
    } else {
      this.authorization = authorization;
    }
  }

  public hasAuthorization = (): boolean => !!this.getAuthorization();

  public setSession = async (token: string): Promise<void> => {
    token = token.replace(/^Bearer\s+/, '');

    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new Error('failed to decode');
    }

    logWithTs('decode successfully', decoded);

    // AsyncStorage 에 토큰 저장
    await this.storageProvider.set(Session.STORAGE_KEY.SESSION_AUTHORIZATION, token);

    // API Instance header 설정
    this.api.setHeader("Authorization", token);

    // update authorization
    this.setAuthorization(token);
  }

  public check = async (): Promise<void> => {
    if (!this.api.headers?.Authorization) {
      throw new Error('!this.api.headers?.Authorization');
    }

    if (!(await this.api.get("/v1/auth/session")).ok) {
      throw new Error('unauthorized');
    }
  };

  // TODO 토큰 갱신
  public update = async (): Promise<void> => {};

  /**
   * 서버에서 토큰을 만료처리하고 로컬 API 인스턴스의 헤더에서 토큰을 제거한다.
   * 서버에서 토큰 만료에 실패해도 성공으로 반환될 수 있다.
   */
  public deleteSession = async (): Promise<void> => {
    // 서버에서 토큰 만료 처리
    await this.api.delete("/v1/auth/session");

    // API Instance header 에서 토큰 제거
    this.api.deleteHeader("Authorization");

    // 스토리지에서 authorization 제거
    await this.storageProvider.remove(Session.STORAGE_KEY.SESSION_AUTHORIZATION);
  }
}

export namespace Session {
  export enum STORAGE_KEY {
    SESSION_AUTHORIZATION = 'SESSION_AUTHORIZATION',
  }
}
