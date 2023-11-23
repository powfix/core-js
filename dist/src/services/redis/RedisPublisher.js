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
exports.RedisPublisher = void 0;
const RedisClient_1 = require("./RedisClient");
class RedisPublisher extends RedisClient_1.RedisClient {
    constructor(options) {
        super(options);
        // Make public method
        this.publish = (channel, data) => __awaiter(this, void 0, void 0, function* () {
            const stringifyData = typeof data !== 'string' ? JSON.stringify(data) : data;
            console.log(Date.now(), 'Redis <--- Server', channel, stringifyData);
            yield this.client.publish(channel, stringifyData);
        });
        console.log(Date.now(), "RedisPublisher", 'initialized');
    }
    start() {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.start.call(this);
        });
    }
    stop() {
        const _super = Object.create(null, {
            stop: { get: () => super.stop }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.stop.call(this);
        });
    }
}
exports.RedisPublisher = RedisPublisher;
