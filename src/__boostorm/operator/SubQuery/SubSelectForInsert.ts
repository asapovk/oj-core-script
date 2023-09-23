import Fetch from '../../query/Fetch';
import { WhereParams } from '../../common';
import * as EntitieTypes from '../../entities';
import Insert from '../../query/Insert';

export type SubSelectForInsertReturn = {
  type: 'subSelectForInsert';
  value: string;
};

export type SubSelectForInsertArgs<T extends keyof EntitieTypes._Entities> = {
  table: T;
  where: WhereParams<T>;
  select: keyof EntitieTypes._Entities[T]['entitie'];
};

export type SubSelectForInsertType = <T extends keyof EntitieTypes._Entities>(
  args: SubSelectForInsertArgs<T>,
) => (parent: Insert) => SubSelectForInsertReturn;

const SubSelectForInsert: SubSelectForInsertType = (args) => (parent) => {
  const paramsArrayNumbers = parent.paramsArrayNumbers;
  const parentParams = parent.getParams();
  const selectForInsertQB = new Fetch(parent.schema, parentParams.length);

  const result = selectForInsertQB.fetch({
    table: args.table,
    where: args.where,
    select: args.select,
    selectConstans: paramsArrayNumbers,
    limit: 1,
    offset: 0,
  });

  parent.pushParams(selectForInsertQB.getParams());
  return {
    type: 'subSelectForInsert',
    value: result,
  };
};

export default SubSelectForInsert;

// export type SubSelect = <L extends keyof EntitieTypes._Entities>
// (c: Query,
// tableName: L,
// paramName: keyof EntitieTypes._Entities[L]
// ) => any
