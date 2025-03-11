import {Hooks, SequelizeHooks} from "sequelize/types/hooks";
import {Attributes, CreationAttributes} from "sequelize/types/model";
import {HookType} from "./HookType";

export type HookFn = SequelizeHooks<Hooks['_model'], Attributes<Hooks>, CreationAttributes<Hooks>>[HookType];
