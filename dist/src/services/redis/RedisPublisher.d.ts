import {RedisClient, RedisClientOptions} from "./RedisClient";

export declare class RedisPublisher extends RedisClient {
    constructor(options?: RedisClientOptions);
    start(): Promise<RedisClient.Status>;
    stop(): Promise<RedisClient.Status>;
    publish: (channel: string, data: string | object) => Promise<void>;
}
