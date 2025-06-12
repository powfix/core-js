import {TransactionManagerTimeoutAction} from "../constants/index.js";
import {Transaction} from "sequelize";

export interface TransactionManagerAddOption {
  timeout?: number;
  timeoutAction?: TransactionManagerTimeoutAction;
}

export type TransactionManagerEventTypes = {
  onUnhandledTransaction: (transaction: Transaction, handled: boolean) => any;
}
