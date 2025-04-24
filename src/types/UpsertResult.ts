import {Model} from "sequelize-typescript";

export type UpsertResult<M extends Model> = [M, boolean];
