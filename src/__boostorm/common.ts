import * as EntitieTypes from './entities';
import Query, { QueryBuilder } from './QueryBuilder';

export type GetDates<FromType> = {
  [K in keyof FromType]: FromType[K] extends Date ? FromType[K] : {};
};

export type GetNumbers<FromType> = {
  [K in keyof FromType]: FromType[K] extends number ? FromType[K] : {};
};

export type GetNames<FromType> = {
  [K in keyof FromType]: FromType[K] extends never ? never : K;
}[keyof FromType];

export type GetObject<R, FromNames extends keyof R> = {
  [T in FromNames]: R[T];
};
export type GetEntit<Type> = Type extends { entitie: unknown }
  ? Type['entitie']
  : {};
export type GetJoins<Key> = Key extends keyof EntitieTypes._Entities
  ? EntitieTypes._Entities[Key]['joins']
  : '';
export type GetCreate<Type> = Type extends { create: unknown }
  ? Type['create']
  : {};
export type GetSelectedFields<Type> = Type extends {
  selectedFields: Array<unknown>;
}
  ? Type['selectedFields'][0]
  : {};
export type GetKeyOfEnt<Key> = Key extends keyof EntitieTypes._Entities
  ? Key
  : never;

export type WhereParams<T extends keyof EntitieTypes._Entities> = Partial<{
  [K in keyof GetEntit<EntitieTypes._Entities[T]>]:
    | string
    | number
    | null
    | ((
        qb: QueryBuilder,
        tableName: string,
        paramName: string,
      ) => string | null);
}>;

export type Order<T extends keyof EntitieTypes._Entities> =
  | DefaultOrder
  | ((c: EntitieTypes._Entities[T]['entitie']) => any);

export type DefaultOrder = 'by_primary_key_DESC' | 'by_primary_key';

export type WhereUnsafe<Type> = Partial<{
  [K in keyof Type]:
    | string
    | number
    | null
    | ((
        getParam: (p: any) => number,
        tableName: string,
        paramName: string,
      ) => string | null);
}>;

export type OrderUnsafe<Type> = (c: Type) => any;

export type JointParams<T extends keyof EntitieTypes._Entities> = Join<
  EntitieTypes._Entities[T]['joins']
>;

export type Join<T> = {
  join?: Join<GetJoins<T>> | Array<Join<GetJoins<T>>>;
  table: T;
  where?: (p: EntitieTypes._Entities) => any;
  operator?: 'inner' | 'left';
  andOn?: string;
  select?: string;
  as?: string;
};
export type Join_2<T> = {
  table: T;
  where?: (p: EntitieTypes._Entities) => string;
  select?: string;
};

export type SubSelect = <L extends keyof EntitieTypes._Entities>(
  c: Query,
  tableName: L,
  paramName: keyof EntitieTypes._Entities[L],
) => any;
