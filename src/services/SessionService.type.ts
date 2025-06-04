export type SessionServiceEvent = {
  AUTHORIZATION_CHANGED: (authorization: string | null) => void;
}
