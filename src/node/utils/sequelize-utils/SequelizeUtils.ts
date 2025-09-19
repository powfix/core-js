import {ModelAttributeColumnOptions, Op, WhereOptions} from "sequelize";
import {NOT_NULL} from "../../../shared/constants";
import {Model, NonKnownUuidStringKeys, UuidColumnOptionsBase, UuidColumnOptionsForModel} from "./types";
import {NullableUuidInput, UUID} from "@powfix/uuid/node";
import {mapIfNotNullish} from "../../../shared";

export class SequelizeUtils {
  public static decimal2Number(value: any): number | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    const parsed = Number(value);
    if (isNaN(parsed)) {
      throw new Error(`value(typeof=${typeof value}, value=${value}) iNaN(is not number)`);
    }
    return parsed;
  }

  public static buildPrimaryUuidColumn = (): Partial<ModelAttributeColumnOptions> => ({
    ...SequelizeUtils.buildUuidColumn({
      columnName: "uuid",
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: () => UUID.v4().toBuffer(),
    }),
  })

  public static buildUuidColumn<T extends Model, AdditionalKeys extends NonKnownUuidStringKeys<T> = never>(options: UuidColumnOptionsForModel<T, AdditionalKeys>): Partial<ModelAttributeColumnOptions>
  public static buildUuidColumn(options: UuidColumnOptionsBase): Partial<ModelAttributeColumnOptions>
  public static buildUuidColumn(options: UuidColumnOptionsBase): Partial<ModelAttributeColumnOptions> {
    const {columnName, ...overrideOptions} = options
    return {
      type: "binary(16)",
      get() {
        return mapIfNotNullish(this.getDataValue(columnName), value => UUID.from(value))
      },
      set(value: NullableUuidInput) {
        this.setDataValue(columnName, mapIfNotNullish(value, e => UUID.from(e).toBuffer()));
      },
      ...overrideOptions,
    };
  }

  public static getNullableArrayFilter<T=undefined>(arr: (null | any)[]) {
    return {
      [Op.or]: arr.map(value => {
        if (value === null) {
          return {[Op.is]: value}
        } else if (value === NOT_NULL) {
          return {[Op.not]: null}
        } else {
          return {[Op.eq]: value}
        }
      })
    } as WhereOptions<T>
  }
}
