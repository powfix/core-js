import {Hook, HookFn} from "../interfaces";
import {ModelCtor} from "sequelize-typescript";

export class HookUtils {
  public static getFkChanges<T>(pFkValue: T | null | undefined, cFkValue: T | null | undefined): {pFkValue: T | null, cFkValue: T | null} {
    const results: {pFkValue: T | null, cFkValue: T | null} = {pFkValue: null, cFkValue: null};

    if (pFkValue !== undefined && cFkValue !== undefined) {
      if (pFkValue !== cFkValue) {
        if (pFkValue !== null) {
          results.pFkValue = pFkValue;
        }
      }
    }

    if (cFkValue !== null && cFkValue !== undefined) {
      results.cFkValue = cFkValue;
    }

    return results;
  }

  public static makeModelHooks(model: ModelCtor, fns: {
    create: HookFn,
    update: HookFn,
    destroy: HookFn,
  }): Hook[] {
    return [
      {model, hookType: 'afterCreate', fn: fns.create},
      {model, hookType: 'afterBulkCreate', fn: fns.create},

      {model, hookType: 'afterUpdate', fn: fns.update},
      {model, hookType: 'afterBulkUpdate', fn: fns.update},

      {model, hookType: 'afterDestroy', fn: fns.destroy},
      {model, hookType: 'afterBulkDestroy', fn: fns.destroy},
    ];
  }
}
