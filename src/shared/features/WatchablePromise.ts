import type {WatchablePromiseStatus} from "./WatchablePromise.types";

export class WatchablePromise<T, E = Error> extends Promise<T> {
  public static from<P extends typeof WatchablePromise, T>(this: P, promise: Promise<T>): InstanceType<P> {
    return new this<T>((resolve, reject) => promise.then(resolve, reject)) as InstanceType<P>;
  }

  #settled: boolean = false;
  #status: WatchablePromiseStatus = 'pending';
  #result: T | PromiseLike<T> | E | undefined = undefined;

  constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
    super((resolve, reject) => {
      executor(
        (value) => {
          resolve(value);
          this.#settled = true;
          this.#status = 'fulfilled';
          this.#result = value;
        },
        (reason: E) => {
          reject(reason);
          this.#settled = true;
          this.#status = 'rejected';
          this.#result = reason;
        },
      )
    })
  }

  get settled(): boolean {
    return this.#settled;
  }

  get status(): WatchablePromiseStatus {
    return this.#status;
  }

  get result(): T | PromiseLike<T> | E | undefined {
    return this.#result;
  }
}
