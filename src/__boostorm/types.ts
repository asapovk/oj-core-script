import { RepoType } from '../repository'

export type OmitFields<O, K extends keyof O> = Omit<O, K>;
export type PickAsArray<O, K extends keyof O> = {
  [T in K]: O[T] extends Array<unknown> ? O[T] : Array<O[T]>;
};
export type Maby<X> = X | null;

export type Filter<
  TypeName,
  FiledName extends keyof TypeName,
  FilterType extends 'range' | 'set',
  > = {
    fieldName: FiledName;
    type: FilterType;
    filterParams: Array<string | number>;
  };

//export type RepoType = RepoMutationType & QueryRepoType
export type Repository = <N extends keyof RepoType> (name: N, params: RepoType[N]['params']) =>
  Promise<RepoType[N]['response']>
