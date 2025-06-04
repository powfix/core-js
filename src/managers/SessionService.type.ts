import {AxiosInstance} from "axios";
import {StorageProvider} from "../interfaces";

export interface SessionServiceOptions {
  api: AxiosInstance;
  storageProvider: StorageProvider;
}

export type SessionServiceEvent = {
  AUTHORIZATION_CHANGED: (authorization: string | null) => void;
}
