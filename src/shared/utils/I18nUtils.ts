import type {Resource} from 'i18next';
import deepmerge from "deepmerge";

export class I18nUtils {
  public static mergeResources(...resources: Resource[]): Resource {
    return resources.reduce((acc, resource) => deepmerge(acc, resource), {});
  }
}
