import Select from '../../query/Select';
import QueryBuilder from '../../QueryBuilder';
import { WhereClauseOperator } from '.';

export type InArgs = Array<string | number> | InSelectedArgs | undefined;

export type InSelectedArgs = {
  subSelect: (parent: QueryBuilder) => any;
};

const In: WhereClauseOperator<InArgs> = (params) => (qb, table, param) => {
  //@ts-ignore
  if (params && params.subSelect) {
    //@ts-ignore
    return `${table}.${param} in (\n${params.subSelect(qb).value}\n)`;
  }

  const parNumbers: Array<string> = [];
  if (Array.isArray(params)) {
    for (const p of params) {
      parNumbers.push(`$${qb.getParamNumber(p)}`);
    }
    return `${table}.${param} in (${parNumbers.join(',')})`;
  }
  return null;
};

export default In;
