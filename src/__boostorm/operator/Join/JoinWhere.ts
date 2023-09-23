import { GetEntit } from '../../common';
import QueryBuilder from '../../QueryBuilder';

export type JoinWhereParamsM<O> = Partial<{
  [K in keyof GetEntit<O>]:
    | string
    | number
    | null
    | ((
        qb: QueryBuilder,
        tableName: string,
        paramName: string,
      ) => string | null);
}>;

export type JoinWhereType = <O>(
  o: O,
  where: JoinWhereParamsM<O> | Array<JoinWhereParamsM<O>>,
) => any;

export const JoinWhere: JoinWhereType = (o, where) => where;
