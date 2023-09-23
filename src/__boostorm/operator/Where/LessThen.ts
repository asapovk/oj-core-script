import { WhereClauseOperator } from '.';

export type LessThenArgs = number | Date;

const LessThen: WhereClauseOperator<LessThenArgs> =
  (params) => (qb, table, param) => {
    return `${table}.${param} < $${qb.getParamNumber(params)}`;
  };

export default LessThen;
