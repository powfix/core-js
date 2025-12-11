export type If<C extends boolean, T, F = undefined> = C extends true ? T : F;
