import { RedisClient } from "./RedisClient";
export declare class RedisPublisher extends RedisClient {
    private logging;
    constructor(options?: RedisClient.RedisClientOptions);
    start(): Promise<RedisClient.Status>;
    stop(): Promise<RedisClient.Status>;
    setLogging(logging: RedisPublisher.LOGGING): void;
    getLogging(): RedisPublisher.LOGGING;
    publish: (channel: string, data: string | object) => Promise<void>;
}
export declare namespace RedisPublisher {
    type LOGGING = 'none' | 'length' | 'data';
}
