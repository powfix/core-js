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
exports.RedisSubscriber = void 0;
const RedisClient_1 = require("./RedisClient");
class RedisSubscriber extends RedisClient_1.RedisClient {
    constructor(options) {
        super(options);
        this.subscribe = (channels, listener, bufferMode) => __awaiter(this, void 0, void 0, function* () {
            for (const channel of Array.isArray(channels) ? channels : [channels]) {
                if ((/\*/g).test(channel)) {
                    yield this.client.pSubscribe(channel, listener, bufferMode);
                }
                else {
                    yield this.client.subscribe(channel, listener, bufferMode);
                }
            }
        });
        this.unsubscribe = (channels, listener, bufferMode) => __awaiter(this, void 0, void 0, function* () {
            for (const channel of Array.isArray(channels) ? channels : [channels]) {
                if ((/\*/g).test(channel)) {
                    yield this.client.pUnsubscribe(channel, listener, bufferMode);
                }
                else {
                    yield this.client.unsubscribe(channel, listener, bufferMode);
                }
            }
        });
        console.log(Date.now(), 'Subscriber', 'initialized');
    }
    start() {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield _super.start.call(this);
            yield this.registerListeners();
            return status;
        });
    }
    stop() {
        const _super = Object.create(null, {
            stop: { get: () => super.stop }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield _super.stop.call(this);
            yield this.unregisterListeners();
            return status;
        });
    }
    registerListeners() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    unregisterListeners() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.RedisSubscriber = RedisSubscriber;
