import type {SortDirection} from "./SortDirection";

export interface SortItem<TField extends string = string> {
  field: TField;
  direction?: SortDirection | null | undefined;
}
