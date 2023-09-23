import { WhereClauseOperator } from '.';

export type ModeThenArgs = number | Date;

const MoreThen: WhereClauseOperator<ModeThenArgs> =
  (params) => (qb, table, param) => {
    return `${table}.${param} > $${qb.getParamNumber(params)}`;
  };

export default MoreThen;
