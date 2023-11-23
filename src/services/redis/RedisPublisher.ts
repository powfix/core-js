import {RedisClient, RedisClientOptions} from "./RedisClient";

export class RedisPublisher extends RedisClient {
  public constructor(options?: RedisClientOptions) {
    super(options);
    console.log(Date.now(), "RedisPublisher", 'initialized');
  }

  public async start(): Promise<RedisClient.Status> {
    return await super.start();
  }

  public async stop(): Promise<RedisClient.Status> {
    return await super.stop();
  }

  // Make public method
  public publish = async (channel: string, data: string | object) => {
    const stringifyData = typeof data !== 'string' ? JSON.stringify(data) : data;
    console.log(Date.now(), 'Redis <--- Server', channel, stringifyData);
    await this.client.publish(channel, stringifyData);
  }
}
