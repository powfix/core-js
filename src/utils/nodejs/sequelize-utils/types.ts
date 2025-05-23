import {ModelAttributeColumnOptions} from "sequelize";

export type Model = Record<string, any> | undefined;

export type ExtractUuidKeys<T extends Model> = {
  [Property in keyof T]: Property extends `${string}Uuid` | 'uuid'
    ? Property
    : never;
}[keyof T];

export type ExtractStringKeys<T extends Model> = {
  [Property in keyof T]: string extends T[Property]? Property: never
}[keyof T]

export type ConcreteUuidKeys<T extends Model> = ExtractUuidKeys<T>;

export type NonKnownUuidStringKeys<T extends Model> = Exclude<ExtractStringKeys<T>, ConcreteUuidKeys<T>> & string

export interface UuidColumnOptionsBase extends Omit<ModelAttributeColumnOptions, 'type'>{
  columnName: string;
}

export interface UuidColumnOptionsForModel<T extends Model, AdditionalKeys extends string> extends Omit<ModelAttributeColumnOptions, 'type'>{
  columnName: ConcreteUuidKeys<T> | AdditionalKeys;
}

