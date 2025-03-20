export enum CRUD {
  CREATE = 1,
  READ = 2,
  UPDATE = 3,
  DELETE = 4,
}

export namespace CRUD {
  export function toString(crud: CRUD): string {
    switch (crud) {
      case CRUD.CREATE: return 'Create';
      case CRUD.READ: return 'Read';
      case CRUD.UPDATE: return 'Update';
      case CRUD.DELETE: return 'Delete';
      default: throw new Error('Unknown crud: ' + crud);
    }
  }
}
