import {ModelAttributeColumnOptions, Op, WhereOptions} from "sequelize";
import {UuidUtils} from "../../UuidUtils";
import {NOT_NULL} from "../../../constants";
import {Model, NonKnownUuidStringKeys, UuidColumnOptionsBase, UuidColumnOptionsForModel} from "./types";

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
      defaultValue: () => UuidUtils.toBuffer(UuidUtils.v4()),
    }),
  })

  public static buildUuidColumn<T extends Model, AdditionalKeys extends NonKnownUuidStringKeys<T> = never>(options: UuidColumnOptionsForModel<T, AdditionalKeys>): Partial<ModelAttributeColumnOptions>
  public static buildUuidColumn(options: UuidColumnOptionsBase): Partial<ModelAttributeColumnOptions>
  public static buildUuidColumn(options: UuidColumnOptionsBase): Partial<ModelAttributeColumnOptions> {
    const {columnName, ...overrideOptions} = options
    if (overrideOptions.allowNull) {
      return {
        type: "binary(16)",
        get() {
          const value = this.getDataValue(columnName)

          if (value === null) {
            return value
          }

          return UuidUtils.toString(this.getDataValue(columnName));
        },
        set(uuid: string | null) {
          this.setDataValue(columnName, uuid === null ? null : UuidUtils.toBuffer(uuid));
        },
        ...overrideOptions
      }
    } else {
      return {
        type: "binary(16)",
        get() {
          return UuidUtils.toString(this.getDataValue(columnName));
        },
        set(uuid: string) {
          this.setDataValue(columnName, UuidUtils.toBuffer(uuid));
        },
        ...overrideOptions
      }
    }
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
