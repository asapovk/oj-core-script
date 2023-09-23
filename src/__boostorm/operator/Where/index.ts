import QueryBuilder from '../../QueryBuilder';
export { default as In } from './In';
export { default as NotIn } from './NotIn';
export { default as BetweenInclues } from './Between';
export { default as Not } from './Not';
export { default as Eq } from './Eq';
export { default as Like } from './Like';
export { default as MoreThen } from './MoreThen';
export { default as LessThen } from './LessThen';

export type WhereClauseOperator<Args> = (
  args: Args,
) => (qb: QueryBuilder, table: string, param: string) => string | null;
