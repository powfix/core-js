import {jwtDecode, JwtPayload} from "jwt-decode";
import {AxiosInstance} from "axios";
import moment from "moment";
import {StorageProvider} from "../interfaces";
import EventEmitter from 'eventemitter3';
import {SessionManagerEvent, SessionManagerOptions} from "./SessionManager.type";

export class SessionManager extends EventEmitter<SessionManagerEvent> {
  private static readonly DEFAULT_AUTHORIZATION_STORAGE_KEY: string = 'AUTHORIZATION';

  // Service parameters
  protected api: AxiosInstance;
  protected storageProvider: StorageProvider;

  public constructor(options: SessionManagerOptions) {
    super();

    // Init service parameters
    this.api = options.api;
    this.storageProvider = options.storageProvider;

    // Logging
    console.log('SessionManager initialized', Date.now(), options.api);
  }

  private get key(): string {
    try {
      if (this.storageProvider.key) {
        return this.storageProvider.key();
      }
    } catch (e) {
      console.error(e);
    }

    return SessionManager.DEFAULT_AUTHORIZATION_STORAGE_KEY;
  }

  public async hasAuthorization(): Promise<boolean> {
    return !!(await this.getAuthorization());
  }

  public async getAuthorization(): Promise<string | null> {
    return this.storageProvider.get(this.key);
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
      await this.storageProvider.set(this.key, nextAuthorization);

      // API Instance header 설정
      this.api.defaults.headers.common.Authorization = `Bearer ${nextAuthorization}`;

      // Emit
      this.emit('AUTHORIZATION_CHANGED', nextAuthorization);

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
    await this.storageProvider.remove(this.key);

    // Emit
    this.emit('AUTHORIZATION_CHANGED', null);
  }
}
