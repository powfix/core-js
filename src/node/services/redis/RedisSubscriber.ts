import {RedisClient} from "./RedisClient";
import {PubSubListener} from "@redis/client/dist/lib/client/pub-sub";
import {castArray} from "../../../shared/utils";

export class RedisSubscriber extends RedisClient {
  public constructor(options?: RedisClient.RedisClientOptions) {
    super(options);
    console.log(Date.now(), 'Subscriber', 'initialized');
  }

  public async subscribe<T extends boolean = false>(channels: string | string[], listener: PubSubListener<T>, bufferMode?: T | undefined) {
    for (const channel of castArray(channels)) {
      if ((/\*/g).test(channel)) {
        await this.client.pSubscribe(channel, listener, bufferMode);
      } else {
        await this.client.subscribe(channel, listener, bufferMode);
      }
    }
  }

  public async unsubscribe<T extends boolean = false>(channels: string | string[], listener?: PubSubListener<T> | undefined, bufferMode?: T | undefined): Promise<void> {
    for (const channel of castArray(channels)) {
      if ((/\*/g).test(channel)) {
        await this.client.pUnsubscribe(channel, listener, bufferMode);
      } else {
        await this.client.unsubscribe(channel, listener, bufferMode);
      }
    }
  }

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
