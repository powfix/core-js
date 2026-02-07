import {SortItem, SortUtils as BaseSortUtils} from "../../shared";
import type {GridSortModel} from "@mui/x-data-grid";

export class SortUtils extends BaseSortUtils {
  static toGridSortItem<TField extends string = string>(item: SortItem<TField>): GridSortModel[number] {
    return {
      field: item.field,
      sort: item.direction,
    };
  }

  static toGridSortModel<TField extends string = string>(items: SortItem<TField>[]): GridSortModel {
    return items.map(this.toGridSortItem);
  }
}
