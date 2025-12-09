import {ReloadOption} from "./ReloadOption";
import {TransactionOption} from "./TransactionOption";

export interface UpsertOptions extends Partial<ReloadOption>, Partial<TransactionOption> {}
