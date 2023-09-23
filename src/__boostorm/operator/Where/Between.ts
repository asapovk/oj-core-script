import { WhereClauseOperator } from '.';

type valu = number | Date;

export type BetweenArgs = [valu, valu];

const Between: WhereClauseOperator<BetweenArgs> =
  (params) => (qb, table, param) => {
    return `${table}.${param} > $${qb.getParamNumber(
      params[0],
    )} and $${qb.getParamNumber(params[1])} > ${table}.${param}`;
  };

export default Between;
