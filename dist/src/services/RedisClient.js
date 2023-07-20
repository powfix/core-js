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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const redis_1 = require("redis");
const LOG_PREFIX = 'RedisClient';
class RedisClient {
    constructor(options) {
        this.options = {};
        this.status = RedisClient.Status.STOPPED;
        console.log(LOG_PREFIX, 'initialized at', Date.now());
        if (options) {
            this.options = options;
        }
        if (options === null || options === void 0 ? void 0 : options.redisOptions) {
            this.client = (0, redis_1.createClient)(options.redisOptions);
        }
        else {
            this.client = (0, redis_1.createClient)({});
        }
    }
    get logPrefix() {
        return this.options.logPrefix || LOG_PREFIX;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.logPrefix, 'trying to start');
            yield this.client.connect();
            // register event callback
            this.client.on('connect', this.handleOnConnect);
            this.client.on('error', this.handleOnError);
            this.status = RedisClient.Status.RUNNING;
            console.log(this.logPrefix, 'now started');
            return this.status;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.logPrefix, 'trying to stop');
            yield this.client.disconnect();
            // unregister event callback
            this.client.off('connect', this.handleOnConnect);
            this.client.off('error', this.handleOnError);
            this.status = RedisClient.Status.STOPPED;
            console.log(this.logPrefix, 'now stopped');
            return this.status;
        });
    }
    handleOnConnect() {
        console.log(this.logPrefix, 'connected');
    }
    handleOnError(error) {
        console.error(this.logPrefix, error);
    }
}
exports.RedisClient = RedisClient;
(function (RedisClient) {
    let Status;
    (function (Status) {
        Status[Status["RUNNING"] = 0] = "RUNNING";
        Status[Status["STOPPED"] = 1] = "STOPPED";
    })(Status = RedisClient.Status || (RedisClient.Status = {}));
})(RedisClient || (exports.RedisClient = RedisClient = {}));
