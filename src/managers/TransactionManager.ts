import {Transaction} from "sequelize";
import EventEmitter from 'eventemitter3';
import {TransactionManagerLogLevel, TransactionManagerTimeoutAction} from "../constants";
import {TransactionManagerAddOption, TransactionManagerEventTypes} from "./TransactionManager.types";

const LOG_TAG: string = '[TransactionManager]';

class TransactionManager {
  public static DEFAULT_TIMEOUT: number = 60 * 1000;
  public static DEFAULT_ACTION: TransactionManagerTimeoutAction = TransactionManagerTimeoutAction.ROLLBACK;

  // Static instance
  private static instance: TransactionManager;

  // Members
  private logLevel: TransactionManagerLogLevel = TransactionManagerLogLevel.VERBOSE;
  private transactionTimeoutMap = new Map<Transaction, NodeJS.Timeout>();

  // Emitter
  private readonly emitter = new EventEmitter<TransactionManagerEventTypes>();

  public constructor() {
    if (this.logLevel >= TransactionManagerLogLevel.VERBOSE) {
      console.log(LOG_TAG, 'TransactionManager instance initialized');
    }
  }

  public static getInstance(): TransactionManager {
    return this.instance || (this.instance = new TransactionManager());
  }

  private getTransactionLogArg(transaction: Transaction): string {
    const id = (transaction as any)?.id;
    return id ? `transaction(${id})` : '';
  }

  public setLogLevel(logLevel: TransactionManagerLogLevel): void {
    this.logLevel = logLevel;

    if (this.logLevel >= TransactionManagerLogLevel.VERBOSE) {
      console.log(LOG_TAG, 'log level changed to', logLevel);
    }
  }

  public addListener<T extends EventEmitter.EventNames<TransactionManagerEventTypes>>(event: T, fn: EventEmitter.EventListener<TransactionManagerEventTypes, T>) {
    this.emitter.addListener(event, fn);
  }

  public removeListener<T extends EventEmitter.EventNames<TransactionManagerEventTypes>>(event: T, fn: EventEmitter.EventListener<TransactionManagerEventTypes, T>) {
    this.emitter.removeListener(event, fn);
  }

  public add(transaction: Transaction, option?: TransactionManagerAddOption) {
    if (this.transactionTimeoutMap.has(transaction)) {
      if (this.logLevel >= TransactionManagerLogLevel.ERROR) {
        console.error(LOG_TAG, 'transaction already exists');
      }
      return;
    }

    const action = option?.timeoutAction ?? TransactionManager.DEFAULT_ACTION;
    const timeout: number = option?.timeout ?? TransactionManager.DEFAULT_TIMEOUT;
    const handler = setTimeout(this.timeout.bind(this), timeout, transaction, action);
    this.transactionTimeoutMap.set(transaction, handler);

    // Callback
    transaction.afterCommit(this.afterCommit.bind(this));
  }

  public remove(transaction: Transaction) {
    const transactionTimeout = this.transactionTimeoutMap.get(transaction);
    if (transactionTimeout != null) {
      clearTimeout(transactionTimeout);
      this.transactionTimeoutMap.delete(transaction);

      if (this.logLevel >= TransactionManagerLogLevel.VERBOSE) {
        console.log(LOG_TAG, this.getTransactionLogArg(transaction), 'removed');
      }
    }
  }

  private async timeout(transaction: Transaction, action: TransactionManagerTimeoutAction) {
    const finished: unknown = (transaction as any)?.finished;
    if (finished != null) {
      if (this.logLevel >= TransactionManagerLogLevel.VERBOSE) {
        console.log(LOG_TAG, this.getTransactionLogArg(transaction), `is already handled(${finished}) after timeout`);
      }
      this.remove(transaction);
      return;
    }

    try {
      let finished: 'commit' | 'rollback' | undefined;
      switch (action) {
        case TransactionManagerTimeoutAction.ROLLBACK: {
          await transaction.rollback();
          finished = 'rollback';
          break;
        }
        case TransactionManagerTimeoutAction.COMMIT: {
          await transaction.commit();
          finished = 'commit';
          break;
        }
        default: {
          if (this.logLevel >= TransactionManagerLogLevel.ERROR) {
            console.error(LOG_TAG, `unknown action`, action);
          }
          break;
        }
      }

      const handled: boolean = finished != null;
      if (finished != null) {
        if (this.logLevel >= TransactionManagerLogLevel.ERROR) {
          console.error(LOG_TAG, this.getTransactionLogArg(transaction), `handled(${finished}) after timeout`);
        }
      } else {
        if (this.logLevel >= TransactionManagerLogLevel.ERROR) {
          console.error(LOG_TAG, this.getTransactionLogArg(transaction), `not handled 🚫`);
        }
      }

      // Emit
      this.emitter.emit('onUnhandledTransaction', transaction, handled);
    } catch (e) {
      console.error(e);
    }
  }

  private afterCommit(transaction: Transaction) {
    this.remove(transaction);
  }
}

export default TransactionManager;
