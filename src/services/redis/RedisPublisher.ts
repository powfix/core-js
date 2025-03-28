import {RedisClient} from "./RedisClient";

const LOG_TAG: string = '[REDIS-PUB]';

export class RedisPublisher extends RedisClient {
  private logging: RedisPublisher.LOGGING = 'length';

  public constructor(options?: RedisClient.RedisClientOptions) {
    super(options);
    console.log(Date.now(), "RedisPublisher", 'initialized');
  }

  public async start(): Promise<RedisClient.Status> {
    return super.start();
  }

  public async stop(): Promise<RedisClient.Status> {
    return super.stop();
  }

  public setLogging(logging: RedisPublisher.LOGGING) {
    this.logging = logging;
  }

  public getLogging(): RedisPublisher.LOGGING {
    return this.logging;
  }

  // Make public method
  public async publish(channel: string, data: string | object) {
    const stringifyData = typeof data !== 'string' ? JSON.stringify(data) : data;

    switch (this.logging) {
      case "none": {break;}
      case "length": {
        console.log(new Date().toISOString(), LOG_TAG, channel, `[len=${stringifyData.length}]`);
        break;
      }
      case "data": {
        console.log(new Date().toISOString(), LOG_TAG, channel, stringifyData);
        break;
      }
    }
    await this.client.publish(channel, stringifyData);
  }
}

export namespace RedisPublisher {
  export type LOGGING = 'none' | 'length' | 'data';
}
