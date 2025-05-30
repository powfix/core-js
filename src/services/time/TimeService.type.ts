export type TimeServiceOffset = number;

export type TimeServiceTimeStamp = number;

export interface TimeServiceNtpResult {
  // T1 (Client Request Time)
  t1: TimeServiceTimeStamp;

  // T2 (Server Receive Time)
  t2: TimeServiceTimeStamp;

  // T3 (Server Transmit Time)
  t3: TimeServiceTimeStamp;

  // T4 (Client Received Time)
  t4: TimeServiceTimeStamp;
}

export interface TimeServiceServerNtpResult extends Pick<TimeServiceNtpResult, 't2' | 't3'> {}

export type TimeServiceClientTimeProvider = () => TimeServiceTimeStamp;

export type TimeServiceServerTimeProvider = (t1: TimeServiceNtpResult['t1']) => (TimeServiceServerNtpResult | null) | (Promise<TimeServiceServerNtpResult | null>)

export type TimeServiceEvent = {
  SYNCED: (offset: TimeServiceOffset, syncedAt: TimeServiceTimeStamp) => void;
  SYNC_INTERVAL_CHANGED: (interval: number | undefined) => void;
}

export interface TimeServiceOptions {
  syncInterval?: number;                            // Sync interval in milliseconds
  clientTimeProvider?: TimeServiceClientTimeProvider;
  serverTimeProvider?: TimeServiceServerTimeProvider;
}
