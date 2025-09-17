import type {TransactionManager, TransactionManagerAddOption} from "../managers";
import type {Sequelize} from "sequelize-typescript";
import type {Transaction, TransactionOptions} from "sequelize";

export interface MariaDbConnection {
  transactionManager: TransactionManager;
  sequelize: Sequelize;
  transaction: (options?: TransactionOptions, managerOptions?: TransactionManagerAddOption) => Promise<Transaction>
}
