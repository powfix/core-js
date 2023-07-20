import redis, {
  createClient,
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisModules,
  RedisScripts
} from 'redis';

export interface RedisClientOptions {
  logPrefix?: string;
  redisOptions?: redis.RedisClientOptions;
}

const LOG_PREFIX = 'RedisClient';

export class RedisClient {
  private readonly options: RedisClientOptions = {};
  private status: RedisClient.Status = RedisClient.Status.STOPPED;
  protected readonly client: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;

  constructor(options?: RedisClientOptions) {
    console.log(LOG_PREFIX, 'initialized at', Date.now());

    if (options) {
      this.options = options;
    }

    if (options?.redisOptions) {
      this.client = createClient(options.redisOptions);
    } else {
      this.client = createClient({});
    }
  }

  private get logPrefix() {
    return this.options.logPrefix || LOG_PREFIX;
  }

  public async start(): Promise<RedisClient.Status> {
    console.log(this.logPrefix, 'trying to start');
    await this.client.connect();

    // register event callback
    this.client.on('connect', this.handleOnConnect);
    this.client.on('error', this.handleOnError);

    this.status = RedisClient.Status.RUNNING;
    console.log(this.logPrefix, 'now started');
    return this.status;
  }

  public async stop(): Promise<RedisClient.Status> {
    console.log(this.logPrefix, 'trying to stop');
    await this.client.disconnect();

    // unregister event callback
    this.client.off('connect', this.handleOnConnect);
    this.client.off('error', this.handleOnError);

    this.status = RedisClient.Status.STOPPED;
    console.log(this.logPrefix, 'now stopped');
    return this.status;
  }

  private handleOnConnect() {
    console.log(this.logPrefix, 'connected');
  }

  private handleOnError(error: Error) {
    console.error(this.logPrefix, error);
  }
}

export namespace RedisClient {
  export enum Status {
    RUNNING,
    STOPPED,
  }
}
