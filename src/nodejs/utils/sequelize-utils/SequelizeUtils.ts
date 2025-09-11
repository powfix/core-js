import {ModelAttributeColumnOptions, Op, WhereOptions} from "sequelize";
import {UuidUtils} from "../../../shared/utils/UuidUtils";
import {NOT_NULL} from "../../../shared/constants";
import {Model, NonKnownUuidStringKeys, UuidColumnOptionsBase, UuidColumnOptionsForModel} from "./types";
import {UUID} from "../UUID";
import {type UuidInput} from "../../../shared";

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
          const value = this.getDataValue(columnName);
          return value != null ? UUID.from(value) : value;
        },
        set(input: UuidInput | null) {
          const value = input != null ? UUID.from(input).toBuffer() : input;
          this.setDataValue(columnName, value);
        },
        ...overrideOptions,
      }
    } else {
      return {
        type: "binary(16)",
        get() {
          const value = this.getDataValue(columnName);
          return UUID.from(value);
        },
        set(input: UuidInput) {
          const value = UUID.from(input).toBuffer();
          this.setDataValue(columnName, value);
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
