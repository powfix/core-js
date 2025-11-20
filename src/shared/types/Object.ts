/**
 * Makes all properties required and strips `null` from property types.
 *
 * @example
 * type Input = {
 *   a?: string | null
 *   b: number | null
 * }
 * type Result = CustomRequired<Input>
 * // {
 * //   a: string
 * //   b: number
 * // }
 */
type CustomRequired<T> = {
  [P in keyof T]-?: T[P] extends infer A | null ? A : T[P]
}

type R = Record<string, any>

/**
 * Extracts keys of properties whose value is an object (but not arrays).
 *
 * @example
 * type Example = {
 *   id: number
 *   info: { name: string }
 *   tags: string[]
 * }
 * type ObjKeys = ObjectKeys<Example> // "info"
 */
export type ObjectKeys<T, RT = CustomRequired<T>> = keyof {
  [P in keyof RT as RT[P] extends any[] ? never : RT[P] extends R ? P : never]: RT[P]
}

/**
 * Extracts keys of properties whose value is an array of objects.
 *
 * @example
 * type Example = {
 *   id: number
 *   posts: { title: string }[]
 *   scores: number[]
 * }
 * type ArrayObjKeys = ArrayObjectKeys<Example> // "posts"
 */
export type ArrayObjectKeys<T, RT = CustomRequired<T>> = keyof {
  [P in keyof RT as RT[P] extends R[] ? P : never]: RT[P]
}

type DepthLevel = [never, 0, 1, 2, 3, 4, 5]
type DepthType = DepthLevel[number]

/**
 * Recursively collects nested object keys (`a.b.c`) up to a defined depth.
 *
 * Default depth = 5.
 *
 * @example
 * type Example = {
 *   user: {
 *     profile: {
 *       email: string
 *     }
 *   }
 *   tags: string[]
 * }
 *
 * type Keys = NestedObjectKeys<Example>
 * // "user" | "user.profile" | "user.profile.email"
 */
export type NestedObjectKeys<
  T,
  Depth extends DepthType = 5,
  RT = CustomRequired<T>
> = keyof {
  [P in keyof RT & string as
    Depth extends never
      ? never
      : RT[P] extends any[]
        ? never
        : RT[P] extends R
          ? P | `${P}.${NestedObjectKeys<RT[P], DepthLevel[Depth]>}`
          : never
  ]: RT[P]
}

/**
 * Recursively collects nested object keys inside array properties.
 *
 * Keys include the root array field name and dot paths inside array item objects.
 *
 * @example
 * type Example = {
 *   comments: {
 *     users: {
 *       name: string,
 *       addresses: {
 *         name
 *       }[]
 *     }[]
 *   }[]
 * }
 *
 * type Keys = NestedArrayObjectKeys<Example>
 * // "comments" | "comments.users" | "comments.users.addresses"
 */
export type NestedArrayObjectKeys<
  T,
  Depth extends DepthType = 5,
  RT = CustomRequired<T>
> = keyof {
  [P in keyof RT & string as
    Depth extends never
      ? never
      : RT[P] extends R[]
        ? P | `${P}.${NestedArrayObjectKeys<RT[P][number], DepthLevel[Depth]>}`
        : never
  ]: RT[P]
}

/**
 * Picks only properties that are objects (not arrays).
 *
 * @example
 * type Example = {
 *   id: number
 *   settings: { dark: boolean }
 *   history: string[]
 * }
 *
 * type Result = PickObjects<Example>
 * // { settings: { dark: boolean } }
 */
export type PickObjects<T> = Pick<T, ObjectKeys<T>>

/**
 * Picks only properties that are arrays of objects.
 *
 * @example
 * type Example = {
 *   users: { name: string }[]
 *   count: number
 * }
 *
 * type Result = PickArrayObjects<Example>
 * // { users: { name: string }[] }
 */
export type PickArrayObjects<T> = Pick<T, ArrayObjectKeys<T>>
