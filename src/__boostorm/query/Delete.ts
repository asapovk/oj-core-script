import Query from '../QueryBuilder';
import { WhereParams, GetEntit, SubSelect } from '../common';
import * as EntitieTypes from '../entities';
import { Schema } from '../Schema';

export type DeleteArgs<T extends keyof EntitieTypes._Entities> = {
  table: T;
  where: WhereParams<T> | Array<WhereParams<T>>;
};

class Delete extends Query {
  constructor(schema: Schema) {
    super(schema);
  }

  public delete = <T extends keyof EntitieTypes._Entities>(
    args: DeleteArgs<T>,
  ) => {
    this.addWhereString(args.where, args.table);
    if (this.whereString) {
      this.whereString = `\nwhere` + this.whereString;
    }
    return `delete from ${args.table} ${this.whereString}`;
  };
}

export default Delete;
