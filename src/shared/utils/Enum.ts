import {EnumEntries} from "./Enum.types";

export class Enum<E extends object> {
  public static entries<E extends object>(e: E): EnumEntries<E> {
    return Object.entries(e).filter(([key, value]) => !/^-?\d+$/g.test(key) && typeof value !== 'function') as EnumEntries<E>;
  }

  public static keys<E extends object>(e: E) {
    return Enum.entries(e).map(([key,]) => key);
  }

  public static values<E extends object>(e: E) {
    return Enum.entries(e).map(([,value]) => value);
  }

  public static from<E extends object>(e: E): Enum<E> {
    return new Enum(e);
  }

  private readonly _e: E;
  private readonly _entries: EnumEntries<E>;
  private readonly _keys: ReturnType<typeof Enum.keys<E>>;
  private readonly _values: ReturnType<typeof Enum.values<E>>;

  public constructor(e: E) {
    this._e = e;
    this._entries = Enum.entries(e);
    this._keys = Enum.keys(e);
    this._values = Enum.values(e);
  }

  public value() {
    return this._e;
  }

  public entries() {
    return this._entries;
  }

  public keys() {
    return this._keys;
  }

  public values() {
    return this._values;
  }
}
