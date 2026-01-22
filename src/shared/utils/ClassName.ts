import {castArray} from "./global";

export type ClassNameInput = (string | null | undefined) | (string | null | undefined)[];

export class ClassName extends Set<string> {
  public static from<T extends typeof ClassName>(this: T, input: ClassNameInput): InstanceType<T> {
    return new this(input) as InstanceType<T>;
  }

  public static format(values: string[]): string {
    return values.join(String.fromCharCode(32));
  }

  public static toArray(...inputs: (ClassName | ClassNameInput)[]): string[] {
    const values = inputs.map((input) => {
      const instance = input instanceof ClassName ? input : this.from(input);
      return instance.toArray();
    });
    return values.flat();
  }

  public static toString(...inputs: (ClassName | ClassNameInput)[]): string {
    const values = this.toArray(...inputs);
    return this.format(values);
  }

  constructor(input: ClassNameInput) {
    super();
    for (const value of castArray(input)) {
      if (value == null) {
        continue;
      }

      if (typeof value === "string") {
        if (value === "") {
          continue;
        }

        this.add(value);
      }
    }
  }

  toArray(): string[] {
    return Array.from(this);
  }

  toString(): string {
    return ClassName.format(this.toArray());
  }
}
