import EventEmitter from "events";

const LOG_TAG: string = 'TimeService';

export class TimeService {
  protected status: TimeService.Status = TimeService.Status.STOPPED;
  private offset?: TimeService.Offset | undefined;
  private option: TimeService.Option;
  private syncedAt?: TimeService.TimeStamp | undefined;

  // Emitter
  private emitter = new EventEmitter({});
  public readonly on = this.emitter.on;
  public readonly off = this.emitter.off;
  private readonly emit = this.emitter.emit;

  public static calculateNTPResultOffset(ntpResult: TimeService.NTPResult): TimeService.Offset {
    const {t1, t2, t3, t4} = ntpResult;
    return ((t2 - t1) + (t3 - t4)) / 2;
  }

  constructor(option: TimeService.Option) {
    this.option = option;

    if (option.autoStart) {
      this.start();
    }
  }

  public getOption(): TimeService.Option {
    return this.option;
  }

  public setOption(option: TimeService.Option): TimeService.Option {
    return this.option = option;
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
    this.emit(TimeService.EVENT.SYNCED, syncedAt);

    return syncedAt;
  }

  public getSyncInterval(): number | null {
    if (this.option.syncInterval === undefined) {
      // If option is undefined using default value
      return TimeService.DEFAULT_SYNC_INTERVAL;
    }

    if (this.option.syncInterval === null || this.option.syncInterval === -1) {
      // If option is null, do not sync automatically
      return null;
    }

    return this.option.syncInterval;
  }

  public setSyncInterval(interval: TimeService.Option['syncInterval']) {
    this.option.syncInterval = interval;

    // Emit
    this.emit(TimeService.EVENT.SYNC_INTERVAL_CHANGED, interval);

    if (this.status === TimeService.Status.RUNNING) {
      if (this.syncHandler !== undefined) {
        this.stopSync();
        this.startSync();
      }
    }
  }

  public getClientTime(defaultValue: TimeService.TimeStamp = Date.now()): TimeService.TimeStamp {
    try {
      if (typeof this.option.clientTimeProvider === 'function') {
        return this.option.clientTimeProvider();
      }
    } catch (e) {
      console.error(e);
    }
    return defaultValue;
  }

  public getServerTime(): TimeService.TimeStamp | null {
    const offset = this.getOffset();
    if (offset === undefined) {
      return null;
    }

    const clientTime = this.getClientTime();
    return clientTime + offset;
  }

  public getTime(): number {
    return this.getServerTime() || this.getClientTime();
  }

  public async fetchServerNTPResult(t1: TimeService.NTPResult['t1']): Promise<TimeService.ServerNTPResult | null> {
    try {
      if (typeof this.option.serverTimeProvider === 'function') {
        return await this.option.serverTimeProvider(t1);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  public getStatus(): TimeService.Status {
    return this.status;
  }

  public start() {
    if (this.status !== TimeService.Status.STOPPED) {
      console.warn(LOG_TAG, 'service is not stopped');
      return;
    }

    // Change status
    this.status = TimeService.Status.RUNNING;

    // Sync immediately
    this.sync().finally(() => {});

    // Start sync
    this.startSync();
  }

  public stop() {
    if (this.status !== TimeService.Status.RUNNING) {
      console.warn(LOG_TAG, 'service is not running');
      return;
    }

    // Change status
    this.status = TimeService.Status.RUNNING;

    // Stop sync
    this.stopSync();

    // Reset offset
    this.setOffset(undefined);

    // Reset synced at
    this.setSyncedAt(undefined);
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

  private syncHandler?: ReturnType<typeof setInterval> | undefined;
  private startSync() {
    if (this.syncHandler !== undefined) {
      console.warn('sync handler is not undefined', this.syncHandler);
      return;
    }

    const syncInterval = this.getSyncInterval();
    if (syncInterval === null) {
      return;
    }

    this.syncHandler = setInterval(this.sync, syncInterval);
  };

  private stopSync() {
    if (this.syncHandler === undefined) {
      return;
    }
    clearInterval(this.syncHandler);
    this.syncHandler = undefined;
  };
}

export namespace TimeService {
  export const DEFAULT_SYNC_INTERVAL: number = 60000;

  export enum Status {
    STOPPED = 0,
    RUNNING = 1,
  }

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

  export interface ServerNTPResult extends Pick<NTPResult, 't2' | 't3'> {}

  export type ClientTimeProvider = () => TimeStamp;
  // export type ServerTimeProvider = ((t1: NTPResult['t1']) => ServerNTPResult) | ((t1: NTPResult['t1']) => Promise<ServerNTPResult>);
  export type ServerTimeProvider = (t1: NTPResult['t1']) => (ServerNTPResult | null) | (Promise<ServerNTPResult | null>);

  export interface Option {
    autoStart?: boolean;
    syncInterval?: number | null | undefined;                            // Sync interval in milliseconds
    clientTimeProvider?: ClientTimeProvider | undefined;
    serverTimeProvider?: ServerTimeProvider | undefined;
  }

  export enum EVENT {
    SYNCED = 'SYNCED',
    SYNC_INTERVAL_CHANGED = 'SYNC_INTERVAL_CHANGED',
  }
}
