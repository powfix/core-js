import {ModelCtor} from "sequelize-typescript";
import {HookType} from "./HookType";
import {HookFn} from "./HookFn";

export interface Hook {
  model: ModelCtor;
  hookType: HookType;
  fn: HookFn;
}
