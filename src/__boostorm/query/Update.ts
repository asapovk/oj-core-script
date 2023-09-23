import Query from '../QueryBuilder';
import { WhereParams, GetEntit, SubSelect } from '../common';
import * as EntitieTypes from '../entities';
import { Schema } from '../Schema';

export type UpdateArgs<T extends keyof EntitieTypes._Entities> = {
  table: T;
  where: WhereParams<T> | Array<WhereParams<T>>;
  params: Partial<{
    [K in keyof GetEntit<EntitieTypes._Entities[T]>]: GetEntit<
      EntitieTypes._Entities[T]
    >[K];
  }>;
};

class Update extends Query {
  constructor(schema: Schema) {
    super(schema);
  }

  public update = <T extends keyof EntitieTypes._Entities>(
    args: UpdateArgs<T>,
  ) => {
    const paramsSet: Array<string> = [];
    for (const param in args.params) {
      if (args.params[param] !== undefined) {
        paramsSet.push(
          `${param} = $${this.getParamNumber(args.params[param])}`,
        );
      }
    }
    this.addWhereString(args.where, args.table);
    if (this.whereString) {
      this.whereString = `\nwhere` + this.whereString;
    }
    return `update ${args.table} \nset ${paramsSet.join(', ')}${
      this.whereString
    }`;
  };
}

export default Update;
