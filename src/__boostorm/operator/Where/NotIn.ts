import Select from '../../query/Select';
import QueryBuilder from '../../QueryBuilder';
import { WhereClauseOperator } from '.';

export type NotInArgs = Array<string | number> | NotInSelectedArgs | undefined;

export type NotInSelectedArgs = {
  subSelect: (parent: QueryBuilder) => any;
};

const NotIn: WhereClauseOperator<NotInArgs> =
  (params) => (qb, table, param) => {
    //@ts-ignore
    if (params && params.subSelect) {
      //@ts-ignore
      return `${table}.${param} not in (\n${params.subSelect(qb).value}\n)`;
    }

    const parNumbers: Array<string> = [];
    if (Array.isArray(params)) {
      for (const p of params) {
        parNumbers.push(`$${qb.getParamNumber(p)}`);
      }
      return `${table}.${param}  not in (${parNumbers.join(',')})`;
    }
    return null;
  };

export default NotIn;
