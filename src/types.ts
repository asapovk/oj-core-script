export type OmitFields<O, K extends keyof O> = Omit<O, K>
export type PickAsArray<O, K extends keyof O> = { [T in K]: O[T] extends Array<unknown> ? O[T] : Array<O[T]> }
export type Maby<X> = X | null


//type D<X> = { [T in K]: (X extends R[T] ? C[T] : never) }
type GetNames<FromType> = {
    [K in keyof FromType]:
    FromType[K] extends never ? never : K
}[keyof FromType]

type GetObject<R, FromNames extends keyof R> = { [T in FromNames]: R[T] }

