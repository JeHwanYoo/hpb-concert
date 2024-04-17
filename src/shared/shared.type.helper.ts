type EndsWithId<T> = {
  [K in keyof T]: K extends `${string}Id` | 'id' ? K : never
}
type IdKeys<T> = EndsWithId<T>[keyof T]

export type IdentifierFrom<T, CustomKeys extends keyof T = never> = Partial<
  Pick<T, IdKeys<T> | CustomKeys>
>
