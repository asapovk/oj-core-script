import QueryBuilder from '../../QueryBuilder';
import { WhereClauseOperator } from '.';

export type UnsafeWhereArgs = {
    left: string,
    value: string | number,
    right: string,
  } | undefined;


const UnsafeWhere: WhereClauseOperator<UnsafeWhereArgs> =
  (params) => (qb, table, param) => {
    if (typeof params.right !== undefined) {
      return `${params.left}$${qb.getParamNumber(params.value)}${params.right}`;
    }

    return null;
  };

export default UnsafeWhere;
