import {ModelCtor} from "sequelize-typescript";
import {HookType} from "./HookType.js";
import {HookFn} from "./HookFn.js";

export interface Hook {
  model: ModelCtor;
  hookType: HookType;
  fn: HookFn;
}
