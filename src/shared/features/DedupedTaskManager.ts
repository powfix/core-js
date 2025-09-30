import type {DedupedTaskManagerRunOptions as RunOptions, DedupedTaskManagerTaskKey as TaskKey} from "./DedupedTaskManager.types";

export class DedupedTaskManager {
  #tasks: Map<TaskKey, Promise<any>> = new Map();

  run<T>(key: TaskKey, factory: () => Promise<T>, options?: RunOptions): Promise<T> {
    if (this.#tasks.has(key)) {
      const task = this.#tasks.get(key);
      if (task != null) {
        return task;
      }
    }

    const task = factory().finally(() => {
      if (options?.ttl) {
        setTimeout(() => {
          this.#tasks.delete(key);
        }, options.ttl);
      } else {
        this.#tasks.delete(key);
      }
    });
    this.#tasks.set(key, task);
    return task;
  }

  get tasks() {
    return this.#tasks;
  }
}
