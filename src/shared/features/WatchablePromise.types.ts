export type PromiseExecutor<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;

export type WatchablePromiseStatus = 'pending' | 'fulfilled' | 'rejected';
