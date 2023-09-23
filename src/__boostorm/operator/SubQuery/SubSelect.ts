import Select from '../../query/Select';
import {
  GetNames,
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

export type SubSelectReturn<L> = {
  type: 'select';
  value: string;
  inputArgs: any;
  selectColsMap: object;
  selectedFields: Array<L>;
};

export type SubSelectArgs<
  T extends keyof EntitieTypes._Entities,
  L extends keyof EntitieTypes._Entities[T]['entitie'],
  M extends keyof EntitieTypes._Entities[T]['entitie'],
  A extends {
    [key in keyof EntitieTypes._Entities]: EntitieTypes._Entities[key];
  },
> = {
  from: T;
  select: {
    columns: Array<L>;
    count?: M;
    sum?: GetNames<
      GetNumbers<GetObject<EntitieTypes._Entities[T]['entitie'], M>>
    >;
    dateTrunc?: {
      col: GetNames<
        GetDates<GetObject<EntitieTypes._Entities[T]['entitie'], M>>
      >;
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
  where?: WhereParams<T> | Array<WhereParams<T>>;
  join?: {
    [U in keyof A]?: {
      on: {
        left: GetNames<GetEntit<A[T]>>;
        operator: '<' | '>' | '=' | '!=' | '<=' | '>=';
        right: GetNames<GetEntit<A[U]>>;
      };
      where?: WhereParams<GetKeyOfEnt<U>>;
      select?: Array<GetNames<GetEntit<A[U]>>>;
      aggregate?: 'count' | 'json_agg';
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
  limit: number | 'infinity';
  offset: number;
  //groupBy?: L | Array<L>
  orderBy?: Order<T>;
};

export type SubSelectType = <
  T extends keyof EntitieTypes._Entities,
  L extends keyof EntitieTypes._Entities[T]['entitie'],
  M extends keyof EntitieTypes._Entities[T]['entitie'],
  A extends {
    [key in keyof EntitieTypes._Entities]: EntitieTypes._Entities[key];
  },
>(
  args: SubSelectArgs<T, L, M, A>,
) => (parent: QueryBuilder) => SubSelectReturn<L>;

const SubSelect: SubSelectType = (args) => (parent) => {
  const parentParems = parent.getParams();
  const qb = new Select(parent.schema, parentParems.length);
  const qs = qb.select(args);
  const selectColsMap = qb.getSelectColsMap();
  parent.pushParams(qb.getParams());
  return {
    value: qs,
    type: 'select',
    inputArgs: args,
    selectedFields: args.select.columns,
    selectColsMap,
  };
};

export default SubSelect;
