import {jwtDecode} from "jwt-decode";
import {AxiosInstance} from "axios";

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

const logWithTs = (...p: any) => {
  console.log(Date.now(), ...p);
}

export class Session {
  // Service parameters
  protected api: AxiosInstance;
  protected storageProvider: StorageProvider;

  // Emitter
  // private emitter = new EventEmitter({});
  // public on = this.emitter.on;
  // public off = this.emitter.off;
  // private emit = this.emitter.emit;

  public constructor(options: SessionOptions) {
    // Init service parameters
    console.log('Session initialized', Date.now(), options.api);
    this.api = options.api;
    this.storageProvider = options.storageProvider;
  }

  private getKey(): string {
    try {
      if (this.storageProvider.key) {
        return this.storageProvider.key();
      }
    } catch (e) {
      console.error(e);
    }

    return Session.STORAGE_KEY.SESSION_AUTHORIZATION;
  }

  public async hasAuthorization(): Promise<boolean> {
    return !!(await this.getAuthorization());
  }

  public async getAuthorization(): Promise<string | null> {
    return this.storageProvider.get(this.getKey());
  }

  public async setAuthorization(authorization?: string | null): Promise<string | null> {
    if (authorization === null) {
      await this.removeAuthorization();
      return null;
    }

    let nextAuthorization = await (async () => {
      if (authorization === undefined) {
        return await this.getAuthorization();
      }
      return authorization;
    })();

    if (!nextAuthorization) {
      console.log('nextAuthorization is null or undefined');
      return null;
    }

    try {
      // Replace Bearer prefix
      nextAuthorization = nextAuthorization.replace(/^Bearer\s+/, '');

      console.log(`before jose.decodeJwt("${nextAuthorization}")`);
      const decoded = jwtDecode(nextAuthorization);
      console.log(`after jose.decodeJwt("${nextAuthorization}")`);
      if (!decoded) {
        console.warn('decode failed');
        return null;
      }

      logWithTs('decode successfully', decoded);

      // AsyncStorage 에 토큰 저장
      await this.storageProvider.set(this.getKey(), nextAuthorization);

      // API Instance header 설정
      this.api.defaults.headers.common.Authorization = `Bearer ${nextAuthorization}`;

      // Return
      return nextAuthorization;
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  public async removeAuthorization() {
    // API Instance header 에서 토큰 제거
    delete this.api.defaults.headers.common.Authorization;

    // 스토리지에서 authorization 제거
    await this.storageProvider.remove(this.getKey());
  }
}

export namespace Session {
  export enum STORAGE_KEY {
    SESSION_AUTHORIZATION = 'SESSION_AUTHORIZATION',
  }
}
