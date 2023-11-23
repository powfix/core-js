import redis, {RedisClientType, RedisDefaultModules, RedisFunctions, RedisModules, RedisScripts} from 'redis';

export declare class RedisClient {
    private readonly options;
    private status;
    readonly client: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;
    constructor(options?: RedisClient.RedisClientOptions);
    start(): Promise<RedisClient.Status>;
    stop(): Promise<RedisClient.Status>;
    private handleOnConnect;
    private handleOnError;
}
export declare namespace RedisClient {
    enum Status {
        RUNNING = 0,
        STOPPED = 1
    }
    interface RedisClientOptions {
        redisOptions?: redis.RedisClientOptions;
    }
}
