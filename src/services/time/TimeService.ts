import EventEmitter from 'eventemitter3';
import type {
  TimeServiceClientTimeProvider,
  TimeServiceEvent,
  TimeServiceNtpResult,
  TimeServiceOffset,
  TimeServiceOptions,
  TimeServiceServerNtpResult,
  TimeServiceServerTimeProvider,
  TimeServiceTimeStamp
} from "./TimeService.type.js";

const LOG_TAG: string = 'TimeService';

export class TimeService extends EventEmitter<TimeServiceEvent> {
  // Internal
  private syncHandler?: ReturnType<typeof setInterval>;
  private offset?: TimeServiceOffset;
  private syncedAt?: TimeServiceTimeStamp;

  // Members
  protected syncInterval?: number | null;
  protected clientTimeProvider?: TimeServiceClientTimeProvider;
  protected serverTimeProvider?: TimeServiceServerTimeProvider;

  public static calculateNTPResultOffset(ntpResult: TimeServiceNtpResult): TimeServiceOffset {
    const {t1, t2, t3, t4} = ntpResult;
    return ((t2 - t1) + (t3 - t4)) / 2;
  }

  constructor(options?: TimeServiceOptions) {
    super();

    // Options
    this.syncInterval = options?.syncInterval;
    this.clientTimeProvider = options?.clientTimeProvider;
    this.serverTimeProvider = options?.serverTimeProvider;

    // Bind
    this.sync = this.sync.bind(this);
    this.fetchServerNTPResult = this.fetchServerNTPResult.bind(this);
  }

  public getOffset(defaultValue: TimeServiceOffset): TimeServiceOffset;
  public getOffset(): TimeServiceOffset | undefined;
  public getOffset(defaultValue?: TimeServiceOffset): TimeServiceOffset | undefined {
    if (this.offset !== undefined) {
      return this.offset;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    return undefined;
  }

  public setOffset(offset: TimeServiceOffset): TimeServiceOffset;
  public setOffset(offset: TimeServiceOffset | undefined): TimeServiceOffset;
  public setOffset(offset?: TimeServiceOffset): TimeServiceOffset | undefined {
    return this.offset = offset;
  }

  public getSyncedAt(): TimeServiceTimeStamp | undefined {
    return this.syncedAt;
  }

  private setSyncedAt(syncedAt: TimeServiceTimeStamp | undefined): TimeServiceTimeStamp | undefined {
    return (this.syncedAt = syncedAt);
  }

  public getSyncInterval() {
    return this.syncInterval;
  }

  public setSyncInterval(interval: TimeServiceOptions['syncInterval']) {
    this.syncInterval = interval;

    // Emit
    this.emit('SYNC_INTERVAL_CHANGED', interval);

    if (this.syncHandler !== undefined) {
      this.stopSync();
      this.startSync();
    }
  }

  public getClientTimeProvider() {
    return this.clientTimeProvider;
  }

  public setClientTimeProvider(provider: TimeServiceClientTimeProvider | null | undefined) {
    this.clientTimeProvider = provider ?? undefined;
  }

  public getClientTime() {
    return this.getClientTimeProvider()?.();
  }

  public getServerTimeProvider() {
    return this.serverTimeProvider;
  }

  public setServerTimeProvider(provider: TimeServiceServerTimeProvider | null | undefined) {
    this.serverTimeProvider = provider ?? undefined;
  }

  public getServerTime() {
    const offset = this.getOffset();
    if (offset == null) {
      return offset;
    }

    const clientTime = this.getClientTime();
    if (clientTime == null) {
      return clientTime;
    }

    return clientTime + offset;
  }

  public getTime(): number {
    return this.getServerTime() ?? this.getClientTime() ?? Date.now();
  }

  private async fetchServerNTPResult(t1: TimeServiceNtpResult['t1']): Promise<TimeServiceServerNtpResult | null> {
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

  public async sync(): Promise<TimeServiceOffset | null> {
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

      const ntpResult: TimeServiceNtpResult = {
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
      const syncedAt = Date.now();
      this.setSyncedAt(syncedAt);
      this.emit('SYNCED', offset, syncedAt);
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  public startSync() {
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

  public stopSync() {
    if (this.syncHandler != null) {
      clearInterval(this.syncHandler);
      this.syncHandler = undefined;
    }
  };
}
