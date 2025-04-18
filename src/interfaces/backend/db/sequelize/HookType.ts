import {Hooks, SequelizeHooks} from "sequelize/types/hooks";
import {Attributes, CreationAttributes} from "sequelize/types/model";

export type HookType = keyof SequelizeHooks<Hooks['_model'], Attributes<Hooks>, CreationAttributes<Hooks>>;
