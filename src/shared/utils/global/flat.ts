// flat.ts

export interface FlattenOptions {
  delimiter?: string;
  maxDepth?: number;
  safe?: boolean;
  transformKey?: (key: string) => string;
}

export interface UnflattenOptions {
  delimiter?: string;
  object?: boolean;
  overwrite?: boolean;
  transformKey?: (key: string) => string;
}

function isBuffer(obj: any): boolean {
  return !!(
    obj &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj)
  );
}

function keyIdentity(key: string): string {
  return key;
}

export function flatten<T extends object>(
  target: T,
  opts: FlattenOptions = {}
): Record<string, any> {
  const delimiter = opts.delimiter || '.';
  const maxDepth = opts.maxDepth;
  const transformKey = opts.transformKey || keyIdentity;
  const output: Record<string, any> = {};

  function step(object: any, prev?: string, currentDepth = 1): void {
    Object.keys(object).forEach((key) => {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isbuffer = isBuffer(value);
      const isobject =
        type === '[object Object]' || type === '[object Array]';

      const newKey = prev
        ? `${prev}${delimiter}${transformKey(key)}`
        : transformKey(key);

      if (
        !isarray &&
        !isbuffer &&
        isobject &&
        Object.keys(value).length &&
        (!maxDepth || currentDepth < maxDepth)
      ) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
    });
  }

  step(target);

  return output;
}

export function unflatten<T extends object>(
  target: T,
  opts: UnflattenOptions = {}
): any {
  const delimiter = opts.delimiter || '.';
  const overwrite = opts.overwrite || false;
  const transformKey = opts.transformKey || keyIdentity;
  const result: Record<string, any> = {};

  if (
    isBuffer(target) ||
    Object.prototype.toString.call(target) !== '[object Object]'
  ) {
    return target;
  }

  function getkey(key: string): string | number {
    const parsedKey = Number(key);
    return isNaN(parsedKey) || key.indexOf('.') !== -1 || opts.object
      ? key
      : parsedKey;
  }

  function addKeys(
    keyPrefix: string,
    recipient: Record<string, any>,
    target: Record<string, any>
  ): Record<string, any> {
    return Object.keys(target).reduce((res, key) => {
      res[`${keyPrefix}${delimiter}${key}`] = target[key];
      return res;
    }, recipient);
  }

  function isEmpty(val: any): boolean {
    const type = Object.prototype.toString.call(val);
    const isArray = type === '[object Array]';
    const isObject = type === '[object Object]';

    if (!val) {
      return true;
    } else if (isArray) {
      return !val.length;
    } else if (isObject) {
      return !Object.keys(val).length;
    }
    return false;
  }

  const target2 = Object.keys(target).reduce((res: Record<string, any>, key) => {
    const value = (target as any)[key];
    const type = Object.prototype.toString.call(value);
    const isObject =
      type === '[object Object]' || type === '[object Array]';

    if (!isObject || isEmpty(value)) {
      res[key] = value;
      return res;
    } else {
      return addKeys(key, res, flatten(value, opts));
    }
  }, {});

  Object.keys(target2).forEach((key) => {
    const split = key.split(delimiter).map(transformKey);
    let key1 = getkey(split.shift() as string);
    let key2 = getkey(split[0]);
    let recipient = result;

    while (key2 !== undefined) {
      if (key1 === '__proto__') return;

      const type = Object.prototype.toString.call(recipient[key1]);
      const isobject =
        type === '[object Object]' || type === '[object Array]';

      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        return;
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] =
          typeof key2 === 'number' && !opts.object ? [] : {};
      }

      recipient = recipient[key1];
      if (split.length > 0) {
        key1 = getkey(split.shift() as string);
        key2 = getkey(split[0]);
      }
    }

    recipient[key1] = unflatten((target2 as any)[key], opts);
  });

  return result;
}
