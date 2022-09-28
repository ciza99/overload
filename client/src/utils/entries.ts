import { Entries } from "types/utility";

export const entries = <T extends object>(obj: T): Entries<T> =>
  Object.entries(obj) as never;
