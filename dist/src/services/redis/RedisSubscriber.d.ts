import {RedisClient, RedisClientOptions} from "./RedisClient";
import {PubSubListener} from "@redis/client/dist/lib/client/pub-sub";

export declare class RedisSubscriber extends RedisClient {
    constructor(options?: RedisClientOptions);
    subscribe: <T extends boolean = false>(channels: string | string[], listener: PubSubListener<T>, bufferMode?: T | undefined) => Promise<void>;
    unsubscribe: <T extends boolean = false>(channels: string | string[], listener?: PubSubListener<T> | undefined, bufferMode?: T | undefined) => Promise<void>;
    start(): Promise<RedisClient.Status>;
    stop(): Promise<RedisClient.Status>;
    protected registerListeners(): Promise<void>;
    protected unregisterListeners(): Promise<void>;
}
