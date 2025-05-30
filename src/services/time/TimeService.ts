import EventEmitter from 'eventemitter3';

const LOG_TAG: string = 'TimeService';

export enum TimeServiceStatus {
  STOPPED = 0,
  RUNNING = 1,
}

export class TimeService extends EventEmitter<TimeService.Event> {
  private static readonly DEFAULT_SYNC_INTERVAL: number = 60 * 1000;

  private static DEFAULT_CLIENT_TIME_PROVIDER(): TimeService.TimeStamp {
    return Date.now();
  }

  private syncHandler?: ReturnType<typeof setInterval>;
  private syncInterval?: number;
  private clientTimeProvider?: TimeService.ClientTimeProvider | null;
  private serverTimeProvider?: TimeService.ServerTimeProvider | null;
  private offset?: TimeService.Offset | undefined;
  private syncedAt?: TimeService.TimeStamp | undefined;

  public static calculateNTPResultOffset(ntpResult: TimeService.NTPResult): TimeService.Offset {
    const {t1, t2, t3, t4} = ntpResult;
    return ((t2 - t1) + (t3 - t4)) / 2;
  }

  constructor(option: TimeService.Option) {
    super();

    // Options
    this.syncInterval = option.syncInterval;
    this.clientTimeProvider = option.clientTimeProvider;
    this.serverTimeProvider = option.serverTimeProvider;

    // Bind
    this.sync = this.sync.bind(this);
    this.fetchServerNTPResult = this.fetchServerNTPResult.bind(this);
  }
  public getOffset(defaultValue: TimeService.Offset): TimeService.Offset;
  public getOffset(): TimeService.Offset | undefined;

  public getOffset(defaultValue?: TimeService.Offset): TimeService.Offset | undefined {
    if (this.offset !== undefined) {
      return this.offset;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    return undefined;
  }
  public setOffset(offset: TimeService.Offset): TimeService.Offset
  public setOffset(offset: TimeService.Offset | undefined): TimeService.Offset

  public setOffset(offset?: TimeService.Offset): TimeService.Offset | undefined {
    return this.offset = offset;
  }

  public getSyncedAt(): TimeService.TimeStamp | undefined {
    return this.syncedAt;
  }

  private setSyncedAt(syncedAt: TimeService.TimeStamp | undefined): TimeService.TimeStamp | undefined {
    this.syncedAt = syncedAt;

    // Emit
    this.emit('SYNCED', syncedAt);

    return syncedAt;
  }

  public getSyncInterval(): number {
    return this.syncInterval ?? TimeService.DEFAULT_SYNC_INTERVAL;
  }

  public setSyncInterval(interval: TimeService.Option['syncInterval']) {
    this.syncInterval = interval;

    // Emit
    this.emit('SYNC_INTERVAL_CHANGED', interval);

    if (this.syncHandler !== undefined) {
      this.stopSync();
      this.startSync();
    }
  }

  public getClientTimeProvider(): TimeService.ClientTimeProvider {
    return this.clientTimeProvider ?? TimeService.DEFAULT_CLIENT_TIME_PROVIDER;
  }

  public setClientTimeProvider(provider: TimeService.ClientTimeProvider) {
    this.clientTimeProvider = provider;
  }

  public getClientTime(defaultValue: TimeService.TimeStamp = Date.now()): TimeService.TimeStamp {
    return this.getClientTimeProvider()();
  }

  public getServerTimeProvider() {
    return this.serverTimeProvider;
  }

  public setServerTimeProvider(provider: TimeService.ServerTimeProvider) {
    this.serverTimeProvider = provider;
  }

  public getServerTime(): TimeService.TimeStamp | null {
    const offset = this.getOffset();
    if (offset == null) {
      return null;
    }

    const clientTime = this.getClientTime();
    return clientTime + offset;
  }

  public getTime(): number {
    return this.getServerTime() || this.getClientTime();
  }

  private async fetchServerNTPResult(t1: TimeService.NTPResult['t1']): Promise<TimeService.ServerNTPResult | null> {
    try {
      const provider = this.getServerTimeProvider();
      if (typeof provider === 'function') {
        return await provider(t1);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  public async sync(): Promise<TimeService.Offset | null> {
    try {
      // T1 (Client Request Time)
      const requestedAt: number = Date.now();

      // Fetch server time from server
      const serverNtpResult = await this.fetchServerNTPResult(requestedAt);

      // Check is null
      if (serverNtpResult === null) {
        console.warn(LOG_TAG, 'Failed to get server time');
        return null;
      }

      // T2 (Server Receive Time)
      const {t2} = serverNtpResult;

      // Check is not a number
      if (isNaN(Number(t2))) {
        // Not a Number
        console.error(LOG_TAG, 'invalid server time(t2), not a number', t2);
        return null;
      }

      // T3 (Server Transmit Time)
      const {t3} = serverNtpResult;

      // Check is not a number
      if (isNaN(Number(t3))) {
        // Not a Number
        console.error(LOG_TAG, 'invalid server time(t2), not a number', t2);
        return null;
      }

      // T4 (Client Receive Time)
      const receivedAt: number = Date.now();

      const ntpResult: TimeService.NTPResult = {
        t1: requestedAt,
        t2: t2,
        t3: t3,
        t4: receivedAt,
      };

      // Calculate offset
      const offset = TimeService.calculateNTPResultOffset(ntpResult);

      // Save calculated offset
      this.setOffset(offset);

      // Mark synced timestamp
      this.setSyncedAt(Date.now());
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  private startSync() {
    if (this.syncHandler != null) {
      console.warn('sync is already started');
      return;
    }

    const syncInterval = this.getSyncInterval();
    if (syncInterval == null || syncInterval <= 0) {
      console.warn('sync is not started', 'syncInterval', syncInterval);
      return;
    }

    this.syncHandler = setInterval(this.sync.bind(this), syncInterval);
  };

  private stopSync() {
    if (this.syncHandler != null) {
      clearInterval(this.syncHandler);
      this.syncHandler = undefined;
    }
  };
}

export namespace TimeService {
  export type Offset = number;
  export type TimeStamp = number;

  export interface NTPResult {
    // T1 (Client Request Time)
    t1: TimeStamp;

    // T2 (Server Receive Time)
    t2: TimeStamp;

    // T3 (Server Transmit Time)
    t3: TimeStamp;

    // T4 (Client Receive Time)
    t4: TimeStamp;
  }

  export type Event = 'SYNCED' | 'SYNC_INTERVAL_CHANGED';

  export interface ServerNTPResult extends Pick<NTPResult, 't2' | 't3'> {}

  export type ClientTimeProvider = () => TimeStamp;
  // export type ServerTimeProvider = ((t1: NTPResult['t1']) => ServerNTPResult) | ((t1: NTPResult['t1']) => Promise<ServerNTPResult>);
  export type ServerTimeProvider = (t1: NTPResult['t1']) => (ServerNTPResult | null) | (Promise<ServerNTPResult | null>);

  export interface Option {
    syncInterval?: number;                            // Sync interval in milliseconds
    clientTimeProvider?: ClientTimeProvider;
    serverTimeProvider?: ServerTimeProvider;
  }
}
