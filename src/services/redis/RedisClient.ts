import redis, {
  createClient,
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisModules,
  RedisScripts
} from 'redis';

const LOG_PREFIX = 'RedisClient';

export class RedisClient {
  private readonly options: RedisClient.RedisClientOptions = {};
  private status: RedisClient.Status = RedisClient.Status.STOPPED;
  public readonly client: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;

  public constructor(options?: RedisClient.RedisClientOptions) {
    console.log(Date.now(), LOG_PREFIX, 'initialized');

    if (options) {
      this.options = options;
    }

    if (options?.redisOptions) {
      this.client = createClient(options.redisOptions);
    } else {
      this.client = createClient({});
    }
  }

  public async start(): Promise<RedisClient.Status> {
    console.log(LOG_PREFIX, 'trying to start');

    // register event callback
    this.client.on('connect', this.handleOnConnect);
    this.client.on('error', this.handleOnError);

    await this.client.connect();

    this.status = RedisClient.Status.RUNNING;
    console.log(LOG_PREFIX, 'now started');
    return this.status;
  }

  public async stop(): Promise<RedisClient.Status> {
    console.log(LOG_PREFIX, 'trying to stop');

    // unregister event callback
    this.client.off('connect', this.handleOnConnect);
    this.client.off('error', this.handleOnError);

    if (this.client.isOpen) {
      await this.client.disconnect();
    }

    this.status = RedisClient.Status.STOPPED;
    console.log(LOG_PREFIX, 'now stopped');
    return this.status;
  }

  private handleOnConnect() {
    console.log(LOG_PREFIX, 'connected');
  }

  private handleOnError(error: Error) {
    console.error(LOG_PREFIX, error);
  }
}

export namespace RedisClient {
  export enum Status {
    RUNNING,
    STOPPED,
  }

  export interface RedisClientOptions {
    redisOptions?: redis.RedisClientOptions;
  }
}
