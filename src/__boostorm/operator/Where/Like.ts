import QueryBuilder from '../../QueryBuilder';
import { WhereClauseOperator } from '.';

export type LikeArgs = string | undefined;

export type InSelectedArgs = {
  subSelect: (parent: QueryBuilder) => any;
};

const Like: WhereClauseOperator<LikeArgs> =
  (params: any) => (qb, table, param) => {
    if (params.length) {
      return `${table}.${param} like  '%${params}%'`;
    }

    return null;
  };

export default Like;
