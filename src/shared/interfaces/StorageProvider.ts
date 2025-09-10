export interface StorageProvider {
  key?: () => string;
  set: (key: string, value: string) => Promise<void> | void;
  get: (key: string) => Promise<string | null> | (string | null);
  remove: (key: string) => Promise<void> | void;
  clear?: () => Promise<void> | void;
}
