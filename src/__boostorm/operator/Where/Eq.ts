import Select from '../../query/Select';
import QueryBuilder from '../../QueryBuilder';
import { WhereClauseOperator } from '.';

export type EqArgs = Array<string | number> | EqSelectedArgs | undefined;

export type EqSelectedArgs = {
  subSelect: (parent: QueryBuilder) => any;
};

const Eq: WhereClauseOperator<EqArgs> = (params) => (qb, table, param) => {
  //@ts-ignore
  if (params && params.subSelect) {
    //@ts-ignore
    return `${table}.${param} = (\n${params.subSelect(qb).value}\n)`;
  }

  const parNumbers: Array<string> = [];
  if (Array.isArray(params)) {
    for (const p of params) {
      parNumbers.push(`$${qb.getParamNumber(p)}`);
    }
    return `${table}.${param}  = (${parNumbers.join(',')})`;
  }
  return null;
};

export default Eq;
