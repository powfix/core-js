import {TransactionManagerTimeoutAction} from "../constants";
import {Transaction} from "sequelize";

export interface TransactionManagerAddOption {
  timeout?: number;
  timeoutAction?: TransactionManagerTimeoutAction;
}

export type TransactionManagerEventTypes = {
  onUnhandledTransaction: (transaction: Transaction, handled: boolean) => any;
}
