export type If<C extends boolean | undefined, T, F = undefined> = C extends true ? T : F;
