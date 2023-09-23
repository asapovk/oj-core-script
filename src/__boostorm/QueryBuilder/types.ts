import { WhereParams, JointParams, Order, OrderUnsafe } from '../common';
import * as EntitieTypes from '../entities';

namespace IQueryBuilder {
  export type ChooseWhereCondition = (
    where: any,
    whereTable: string,
    whereParam: string,
  ) => string | null;

  export type AddWhereString = <T extends keyof EntitieTypes._Entities>(
    params: WhereParams<T> | Array<WhereParams<T>>,
    whereTable: string,
  ) => void;

  export type AddJoinStringForSelectWith = (
    args: {
      [key: string]: {
        on: {
          left: string;
          operator: string;
          right: string;
        };
        joinOperator?: 'left' | 'inner';
        where?: unknown;
        join?: unknown;
        select?: Array<string>;
        aggregate?: 'count' | 'json_agg';
      };
    },
    joinToTable: string,
    colsMap?: object | null,
  ) => void;

  export type AddJoinString = <T extends keyof EntitieTypes._Entities>(
    params: JointParams<T> | Array<JointParams<T>>,
    joinToTable: string,
  ) => void;

  export type AddOrderBy = <
    T extends keyof EntitieTypes._Entities,
    Type extends object,
  >(
    args: Order<T> | OrderUnsafe<Type>,
  ) => void;
}

export default IQueryBuilder;
