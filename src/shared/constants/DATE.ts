export class DATE {}

export namespace DATE {
  export enum FORMAT {
    UNIX = 1,
    SECONDS = 2,
    MILLISECONDS = 3,
    ISO_8601 = 4,
  }
  export namespace FORMAT {
    export function toString(format: FORMAT): string {
      switch (format) {
        case FORMAT.UNIX: return 'UNIX';
        case FORMAT.SECONDS: return 'SECONDS';
        case FORMAT.MILLISECONDS: return 'MILLISECONDS';
        case FORMAT.ISO_8601: return 'ISO_8601';
      }
    }
  }
}
