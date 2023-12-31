import {jwtDecode, JwtPayload} from "jwt-decode";
import {AxiosInstance} from "axios";
import moment from "moment";

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

      const decoded = jwtDecode(nextAuthorization) as JwtPayload & {uuid: string};
      if (!decoded) {
        console.warn('JWT decode failed');
        return null;
      }

      console.log('Session:JWT decoded');
      (() => {
        console.log(' - User', decoded.uuid);

        console.log(' - IAT', ...(() => {
          if (!decoded.iat) {return [decoded.iat];}
          const iat = moment.unix(decoded.iat);
          if (!iat.isValid()) {return [decoded.iat];}
          return [decoded.iat, iat.format(), iat.diff(Date.now(), 'days'), 'days left'];
        })());

        console.log(' - NBF', ...(() => {
          if (!decoded.nbf) {return [decoded.nbf];}
          const nbf = moment.unix(decoded.nbf);
          if (!nbf.isValid()) {return [decoded.nbf];}
          return [decoded.nbf, nbf.format(), nbf.diff(Date.now(), 'days'), 'days left'];
        })());

        console.log(' - EXP', ...(() => {
          if (!decoded.exp) {return [decoded.exp];}
          const exp = moment.unix(decoded.exp);
          if (!exp.isValid()) {return [decoded.exp];}
          return [decoded.exp, exp.format(), exp.diff(Date.now(), 'days'), 'days left'];
        })());
      })();

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
