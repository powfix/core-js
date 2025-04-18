import {ModelAttributeColumnOptions, Op, WhereOptions} from "sequelize";
import {UuidUtils} from "../../UuidUtils";

interface UuidColumnOptions extends Omit<ModelAttributeColumnOptions, 'type'>{
  columnName: string,
}


type GetIncludeKeyPatterns<Model> = Model extends { _id: string } ? `${string}Uuid` | 'uuid' : `${string}Uuid`

/**
 * Extracts keys from a type `Model` that end with "Uuid".
 * It also includes any keys provided in the optional type `CustomKeys`.
 * @template Model The type to extract keys from.
 * @template CustomKeys An optional type representing additional keys to include. Defaults to `never`.
 */
type ExtractUuidKeys<Model, CustomKeys = never> = {
  [Property in keyof Model]: Property extends GetIncludeKeyPatterns<Model> ? Property : never
}[keyof Model] | CustomKeys;

type ExtractAdditionalKeys<Model> = {
  [Property in keyof Model]: Property extends GetIncludeKeyPatterns<Model> ? never: Model[Property] extends string | null? Property: never
}[keyof Model]

/**
 * Extracts all UUID-related keys from a `Model`, including those within related objects.
 * It first ensures all properties of the `Model` are required, then it flattens the UUID keys of related objects
 * using `InjectRelationKeys` and finally extracts the keys ending with "Uuid" using `ExtractKeys`.
 * It also includes any keys provided in the optional `AdditionalKeys` type.
 * @template Model The main model type.
 */
export type UuidKeys<Model> = ExtractUuidKeys<Model>


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

  public static getForeignUuidColumn = <Model = never, AdditionalKeys extends Exclude<ExtractAdditionalKeys<Model>, UuidKeys<Model>> = never>({columnName, allowNull}: {
    columnName: Model extends undefined? string: (UuidKeys<Model> | AdditionalKeys),
    allowNull: boolean
  }): Partial<ModelAttributeColumnOptions> => {
    if (allowNull) {
      return {
        type: "binary(16)",
        allowNull,
        get() {
          const value = this.getDataValue(columnName)

          if (value === null) {
            return value
          }

          return UuidUtils.toString(this.getDataValue(columnName));
        },
        set(uuid: string | null) {
          this.setDataValue(columnName, uuid === null ? null : UuidUtils.toBuffer(uuid));
        }
      }
    } else {
      return {
        type: "binary(16)",
        allowNull,
        get() {
          return UuidUtils.toString(this.getDataValue(columnName));
        },
        set(uuid: string) {
          this.setDataValue(columnName, UuidUtils.toBuffer(uuid));
        }
      }
    }
  }

  public static getUuidColumn = ({columnName, ...overrideOptions}: UuidColumnOptions): Partial<ModelAttributeColumnOptions> => {
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
      [Op.and]: arr.map(value => {
        if (value === null) {
          return {
            [Op.is]: null
          }
        }

        return value
      })
    } as WhereOptions<T>
  }
}
