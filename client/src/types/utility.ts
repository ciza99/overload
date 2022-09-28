export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type WithOptional<
  TObject extends object,
  TKey extends keyof TObject
> = Omit<TObject, TKey> & {
  [Key in TKey]?: TObject[TKey];
};
