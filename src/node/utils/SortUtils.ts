import {SortItem, SortUtils as BaseSortUtils} from "../../shared";
import type {Order, OrderItem} from "sequelize";

export class SortUtils extends BaseSortUtils {
  static mapSequelizeOrderItem<TField extends string = string>(item: SortItem<TField>): OrderItem {
    if (item.direction == null) {
      return item.field;
    } else {
      return [item.field, item.direction];
    }
  }

  static mapSequelizeOrder<TField extends string = string>(items: SortItem<TField>[]): Order {
    return items.map(this.mapSequelizeOrderItem);
  }
}
