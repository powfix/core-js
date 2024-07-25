"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeService = void 0;
const events_1 = __importDefault(require("events"));
const LOG_TAG = 'TimeService';
class TimeService {
    static calculateNTPResultOffset(ntpResult) {
        const { t1, t2, t3, t4 } = ntpResult;
        return ((t2 - t1) + (t3 - t4)) / 2;
    }
    constructor(option) {
        this.status = TimeService.Status.STOPPED;
        // Emitter
        this.emitter = new events_1.default({});
        this.on = this.emitter.on;
        this.off = this.emitter.off;
        this.emit = this.emitter.emit;
        this.option = option;
        if (option.autoStart) {
            this.start();
        }
    }
    getOption() {
        return this.option;
    }
    setOption(option) {
        return this.option = option;
    }
    getOffset(defaultValue) {
        if (this.offset !== undefined) {
            return this.offset;
        }
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        return undefined;
    }
    setOffset(offset) {
        return this.offset = offset;
    }
    getSyncedAt() {
        return this.syncedAt;
    }
    setSyncedAt(syncedAt) {
        this.syncedAt = syncedAt;
        // Emit
        this.emit(TimeService.EVENT.SYNCED, syncedAt);
        return syncedAt;
    }
    getSyncInterval() {
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
    setSyncInterval(interval) {
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
    getClientTime(defaultValue = Date.now()) {
        try {
            if (typeof this.option.clientTimeProvider === 'function') {
                return this.option.clientTimeProvider();
            }
        }
        catch (e) {
            console.error(e);
        }
        return defaultValue;
    }
    getServerTime() {
        const offset = this.getOffset();
        if (offset === undefined) {
            return null;
        }
        const clientTime = this.getClientTime();
        return clientTime + offset;
    }
    getTime() {
        return this.getServerTime() || this.getClientTime();
    }
    fetchSeverNTPResult(t1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof this.option.serverTimeProvider === 'function') {
                    return yield this.option.serverTimeProvider(t1);
                }
            }
            catch (e) {
                console.error(e);
            }
            return null;
        });
    }
    getStatus() {
        return this.status;
    }
    start() {
        if (this.status !== TimeService.Status.STOPPED) {
            console.warn(LOG_TAG, 'service is not stopped');
            return;
        }
        // Change status
        this.status = TimeService.Status.RUNNING;
        // Sync immediately
        this.sync().finally(() => { });
        // Start sync
        this.startSync();
    }
    stop() {
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
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // T1 (Client Request Time)
                const requestedAt = Date.now();
                // Fetch server time from server
                const serverNtpResult = yield this.fetchSeverNTPResult(requestedAt);
                // Check is null
                if (serverNtpResult === null) {
                    console.warn(LOG_TAG, 'Failed to get server time');
                    return null;
                }
                // T2 (Server Receive Time)
                const { t2 } = serverNtpResult;
                // Check is not a number
                if (isNaN(Number(t2))) {
                    // Not a Number
                    console.error(LOG_TAG, 'invalid server time(t2), not a number', t2);
                    return null;
                }
                // T3 (Server Transmit Time)
                const { t3 } = serverNtpResult;
                // Check is not a number
                if (isNaN(Number(t3))) {
                    // Not a Number
                    console.error(LOG_TAG, 'invalid server time(t2), not a number', t2);
                    return null;
                }
                // T4 (Client Receive Time)
                const receivedAt = Date.now();
                const ntpResult = {
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
            }
            catch (e) {
                console.error(e);
            }
            return null;
        });
    }
    startSync() {
        if (this.syncHandler !== undefined) {
            console.warn('sync handler is not undefined', this.syncHandler);
            return;
        }
        const syncInterval = this.getSyncInterval();
        if (syncInterval === null) {
            return;
        }
        this.syncHandler = setInterval(this.sync, syncInterval);
    }
    ;
    stopSync() {
        if (this.syncHandler === undefined) {
            return;
        }
        clearInterval(this.syncHandler);
        this.syncHandler = undefined;
    }
    ;
}
exports.TimeService = TimeService;
(function (TimeService) {
    TimeService.DEFAULT_SYNC_INTERVAL = 60000;
    let Status;
    (function (Status) {
        Status[Status["STOPPED"] = 0] = "STOPPED";
        Status[Status["RUNNING"] = 1] = "RUNNING";
    })(Status = TimeService.Status || (TimeService.Status = {}));
    let EVENT;
    (function (EVENT) {
        EVENT["SYNCED"] = "SYNCED";
        EVENT["SYNC_INTERVAL_CHANGED"] = "SYNC_INTERVAL_CHANGED";
    })(EVENT = TimeService.EVENT || (TimeService.EVENT = {}));
})(TimeService || (exports.TimeService = TimeService = {}));
