export class CyclicCounter {
  #min: number;
  #max: number;
  #value: number;

  constructor(min: number, max: number) {
    if (min > max) {
      throw new Error(`min value is should be less or equal than ${this.max}`);
    }

    if (max < min) {
      throw new Error(`max value is should be greater or equal than ${this.min}`);
    }

    this.#min = min;
    this.#max = max;
    this.#value = 0;
  }

  public get min() {
    return this.#min;
  }

  public set min(value: number) {
    if (value > this.max) {
      throw new Error(`min value is should be less or equal than ${this.max}`);
    }
    this.#min = value;
  }

  public get max() {
    return this.#max;
  }

  public set max(value: number) {
    if (value < this.min) {
      throw new Error(`max value is should be greater or equal than ${this.min}`);
    }
    this.#max = value;
  }

  private get value() {
    return this.#value;
  }

  private set value(value) {
    this.#value = this.#normalize(value);
  }

  public current() {
    return this.value;
  }

  public prev() {
    this.value = this.value - 1;
    return this.value;
  }

  public next() {
    this.value = this.value + 1;
    return this.value;
  }

  #normalize(v: number): number {
    const range = this.max - this.min + 1; // 예: 0..255 => 256

    if (!Number.isInteger(v) || !Number.isFinite(v)) {
      throw new RangeError(`Tag value must be a finite integer. got=${v}`);
    }

    // JS의 %는 음수에서 음수가 될 수 있으므로 보정
    return ((v - this.min) % range + range) % range + this.min;
  }
}
