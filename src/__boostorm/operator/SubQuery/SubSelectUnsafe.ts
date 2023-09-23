import SelectUnsafe from '../../query/SelectUnsafe';
import {
  GetNames,
  WhereUnsafe,
  OrderUnsafe,
  GetNumbers,
  GetObject,
  GetDates,
  GetEntit,
  WhereParams,
  GetKeyOfEnt,
  Order,
} from '../../common';
import * as EntitieTypes from '../../entities';
import QueryBuilder from '../../QueryBuilder';

export type SubSelectUnsafeReturn<M> = {
  value: string;
  type: 'selectUnsafe';
  selectedFields: Array<M>;
  inputArgs: any;
  typeArgs: any;
  selectColsMap: object;
};

export type SubSelectUnsafeArgs<
  Type extends object,
  M extends keyof Type,
  A extends {
    [key in keyof EntitieTypes._Entities]: EntitieTypes._Entities[key];
  },
> = {
  from: {
    sql: string;
    as: string;
  };
  select: {
    columns: Array<M>;
    sum?: GetNames<GetNumbers<GetObject<Type, M>>>;
    dateTrunc?: {
      col: GetNames<GetDates<GetObject<Type, M>>>;
      datepart:
        | 'year'
        | 'quarter'
        | 'month'
        | 'week'
        | 'day'
        | 'hour'
        | 'minute'
        | 'second'
        | 'milliseconds';
    };
  };
  where?: WhereUnsafe<Type> | Array<WhereUnsafe<Type>>;
  join?: {
    [U in keyof A]?: {
      on: {
        left: GetNames<Type>;
        operator: '<' | '>' | '=' | '!=' | '<=' | '>=';
        right: GetNames<GetEntit<A[U]>>;
      };
      where?: WhereParams<GetKeyOfEnt<U>>;
      select?: Array<GetNames<GetEntit<A[U]>>>;
      // aggregate?: 'count' | 'json_agg'
      join?: {
        [X in keyof A]?: {
          on: {
            left: GetNames<GetEntit<A[U]>>;
            operator: '<' | '>' | '=' | '!=' | '<=' | '>=';
            right: GetNames<GetEntit<A[X]>>;
          };
          aggregate?: 'count' | 'json_agg';
          select?: Array<GetNames<GetEntit<A[X]>>>;
          where?: WhereParams<GetKeyOfEnt<X>>;
        };
      };
    };
  };
  limit: number;
  offset: number;
  orderBy?: OrderUnsafe<Type>;
};

export type SubSelectUnsafeType = <Type extends object>(
  type: Type,
) => <
  M extends keyof Type,
  A extends {
    [key in keyof EntitieTypes._Entities]: EntitieTypes._Entities[key];
  },
>(
  args: SubSelectUnsafeArgs<Type, M, A>,
) => (parent: QueryBuilder) => SubSelectUnsafeReturn<M>;

const SubSelectUnsafe: SubSelectUnsafeType = (type) => (args) => (parent) => {
  const parentParems = parent.getParams();
  const sq = new SelectUnsafe(parent.schema, parentParems.length);
  const qs = sq.selectUnsafe(type)(args);
  const selectColsMap = sq.getSelectColsMap();
  parent.pushParams(sq.getParams());
  return {
    value: qs,
    type: 'selectUnsafe',
    selectedFields: args.select.columns,
    inputArgs: args,
    typeArgs: type,
    selectColsMap,
  };
};

export default SubSelectUnsafe;
