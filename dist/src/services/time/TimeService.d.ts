/// <reference types="node" />
import EventEmitter from "events";
export declare class TimeService {
    protected status: TimeService.Status;
    private offset?;
    private option;
    private syncedAt?;
    private emitter;
    readonly on: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter;
    readonly off: (eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter;
    private readonly emit;
    static calculateNTPResultOffset(ntpResult: TimeService.NTPResult): TimeService.Offset;
    constructor(option: TimeService.Option);
    getOption(): TimeService.Option;
    setOption(option: TimeService.Option): TimeService.Option;
    getOffset(defaultValue: TimeService.Offset): TimeService.Offset;
    getOffset(): TimeService.Offset | undefined;
    setOffset(offset: TimeService.Offset): TimeService.Offset;
    setOffset(offset: TimeService.Offset | undefined): TimeService.Offset;
    getSyncedAt(): TimeService.TimeStamp | undefined;
    private setSyncedAt;
    getSyncInterval(): number | null;
    setSyncInterval(interval: TimeService.Option['syncInterval']): void;
    getClientTime(defaultValue?: TimeService.TimeStamp): TimeService.TimeStamp;
    getServerTime(): TimeService.TimeStamp | null;
    getTime(): number;
    fetchSeverNTPResult(t1: TimeService.NTPResult['t1']): Promise<TimeService.ServerNTPResult | null>;
    getStatus(): TimeService.Status;
    start(): void;
    stop(): void;
    sync(): Promise<TimeService.Offset | null>;
    private syncHandler?;
    private startSync;
    private stopSync;
}
export declare namespace TimeService {
    const DEFAULT_SYNC_INTERVAL: number;
    enum Status {
        STOPPED = 0,
        RUNNING = 1
    }
    type Offset = number;
    type TimeStamp = number;
    interface NTPResult {
        t1: TimeStamp;
        t2: TimeStamp;
        t3: TimeStamp;
        t4: TimeStamp;
    }
    interface ServerNTPResult extends Pick<NTPResult, 't2' | 't3'> {
    }
    type ClientTimeProvider = () => TimeStamp;
    type ServerTimeProvider = (t1: NTPResult['t1']) => ServerNTPResult | Promise<ServerNTPResult>;
    interface Option {
        autoStart?: boolean;
        syncInterval?: number | null | undefined;
        clientTimeProvider?: ClientTimeProvider | undefined;
        serverTimeProvider?: ServerTimeProvider | undefined;
    }
    enum EVENT {
        SYNCED = "SYNCED",
        SYNC_INTERVAL_CHANGED = "SYNC_INTERVAL_CHANGED"
    }
}
