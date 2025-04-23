import {ModelAttributeColumnOptions, Op, WhereOptions} from "sequelize";
import {UuidUtils} from "../UuidUtils";
import {NOT_NULL} from "../../constants";

type Model = Record<string, any> | undefined;

type GetIncludeKeyPatterns<T extends Model> = T extends { _id: string }
  ? `${string}Uuid` | 'uuid'
  : `${string}Uuid`;

type ExtractUuidKeys<T extends Model> = {
  [Property in keyof T]: Property extends GetIncludeKeyPatterns<T>
    ? Property
    : never;
}[keyof T];

// Type specifically for non-undefined Models, ensuring it results in string literals or never
type ConcreteUuidKeys<T extends Record<string, any>> = ExtractUuidKeys<T>;

// --- Interface Definitions for Overloads ---

// Interface for the general case (T is effectively undefined)
interface UuidColumnOptionsBase extends Omit<ModelAttributeColumnOptions, 'type'>{
  columnName: string; // Any string is allowed
}

// Interface for when a specific Model type is provided
interface UuidColumnOptionsForModel<T extends Record<string, any>> extends Omit<ModelAttributeColumnOptions, 'type'>{
  // Only allows keys of T that match the Uuid pattern
  columnName: ConcreteUuidKeys<T>;
}

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

  public static getPrimaryUuidColumn = (): Partial<ModelAttributeColumnOptions> => ({
    type: "binary(16)",
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: () => UuidUtils.toBuffer(UuidUtils.v4()),
    get() {
      return UuidUtils.toString(this.getDataValue("uuid"));
    },
    set(uuid: string) {
      this.setDataValue("uuid", UuidUtils.toBuffer(uuid));
    }
  })

  public static getUuidColumn<T extends Record<string, any>>(options: UuidColumnOptionsForModel<T>): Partial<ModelAttributeColumnOptions>
  public static getUuidColumn(options: UuidColumnOptionsBase ): Partial<ModelAttributeColumnOptions> {
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
