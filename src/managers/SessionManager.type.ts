import {AxiosInstance} from "axios";
import {StorageProvider} from "../interfaces/StorageProvider";

export interface SessionManagerOptions {
  api: AxiosInstance;
  storageProvider: StorageProvider;
}

export type SessionManagerEvent = {
  AUTHORIZATION_CHANGED: (authorization: string | null) => void;
}
