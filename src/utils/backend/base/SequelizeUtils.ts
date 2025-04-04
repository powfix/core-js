import {ModelAttributeColumnOptions} from "sequelize";
import {UuidUtils} from "../../UuidUtils";

interface UuidColumnOptions extends Omit<ModelAttributeColumnOptions, 'type'>{
  columnName: string,
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

  public static getForeignUuidColumn = ({columnName, allowNull}: {
    columnName: string,
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

}
