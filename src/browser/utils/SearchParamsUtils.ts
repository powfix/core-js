import {UUID} from "@powfix/uuid";

export class SearchParamsUtils {
  public static getString(searchParams: URLSearchParams, key: string) {
    if (!searchParams.has(key)) {
      return null;
    }
    return searchParams.get(key);
  }

  public static getStrings(searchParams: URLSearchParams, key: string) {
    if (!searchParams.has(key)) {
      return null;
    }
    return searchParams.getAll(key);
  }

  public static getUuid(searchParams: URLSearchParams, key: string) {
    const value = this.getString(searchParams, key);
    if (!UUID.isValid(value)) {
      return null;
    }
    return UUID.from(value);
  }

  public static getUuids(searchParams: URLSearchParams, key: string) {
    const values = this.getStrings(searchParams, key);
    if (values == null) {
      return null;
    }
    return values.filter((value) => UUID.isValid(value)).map((value) => UUID.from(value));
  }

  public static from(searchParams: URLSearchParams) {
    return new SearchParamsUtils(searchParams);
  }

  readonly #searchParams: URLSearchParams;

  constructor(searchParams: URLSearchParams) {
    this.#searchParams = searchParams;
  }

  public get searchParams() {
    return this.#searchParams;
  }

  public getString(key: string) {
    return SearchParamsUtils.getString(this.#searchParams, key);
  }

  public getStrings(key: string) {
    return SearchParamsUtils.getStrings(this.#searchParams, key);
  }

  public getUuid(key: string) {
    return SearchParamsUtils.getUuid(this.#searchParams, key);
  }

  public getUuids(key: string) {
    return SearchParamsUtils.getUuids(this.#searchParams, key);
  }
}
