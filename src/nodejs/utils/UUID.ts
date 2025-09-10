import {UUID as BaseUUID} from "../../browser/utils/UUID";

export class UUID extends BaseUUID {
  public toBuffer(): Buffer {
    return Buffer.from(this.bytes);
  }
}
