import { WhereClauseOperator } from '.';

export type NotArgs = string | number | Date | null | undefined;

const Not: WhereClauseOperator<NotArgs> = (val) => (qb, table, param) => {
  if (val === null) {
    return `${table}.${param} is not null`;
  } else if (val === undefined) {
    return null;
  } else {
    const paramNumber = qb.getParamNumber(val);
    return `${table}.${param} != $${paramNumber}`;
  }
  // return `${tableName}.${paramName} is not null`
};

export default Not;
