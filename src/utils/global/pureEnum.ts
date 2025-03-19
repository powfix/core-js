export function pureEnum<E extends object>(e: E) {
  return Object.entries(e).filter(([key, value]) => !/^\d+$/g.test(key) && typeof value !== 'function');
}
