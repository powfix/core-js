import {RedisClient, RedisClientOptions} from "./RedisClient";
import {PubSubListener} from "@redis/client/dist/lib/client/pub-sub";

export class RedisSubscriber extends RedisClient {
  public constructor(options?: RedisClientOptions) {
    super(options);
    console.log(Date.now(), 'Subscriber', 'initialized');
  }

  public subscribe = async <T extends boolean = false>(channels: string | string[], listener: PubSubListener<T>, bufferMode?: T | undefined) => {
    for (const channel of Array.isArray(channels) ? channels : [channels]) {
      if ((/\*/g).test(channel)) {
        await this.client.pSubscribe(channel, listener, bufferMode);
      } else {
        await this.client.subscribe(channel, listener, bufferMode);
      }
    }
  };

  public unsubscribe = async <T extends boolean = false>(channels: string | string[], listener?: PubSubListener<T> | undefined, bufferMode?: T | undefined): Promise<void> => {
    for (const channel of Array.isArray(channels) ? channels : [channels]) {
      if ((/\*/g).test(channel)) {
        await this.client.pUnsubscribe(channel, listener, bufferMode);
      } else {
        await this.client.unsubscribe(channel, listener, bufferMode);
      }
    }
  };

  public async start(): Promise<RedisClient.Status> {
    const status = await super.start();
    await this.registerListeners();
    return status;
  }

  public async stop(): Promise<RedisClient.Status> {
    const status = await super.stop();
    await this.unregisterListeners();
    return status;
  }

  protected async registerListeners() {

  }

  protected async unregisterListeners() {

  }
}
