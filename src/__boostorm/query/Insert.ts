import Query from '../QueryBuilder';
import { GetCreate, SubSelect } from '../common';
import * as EntitieTypes from '../entities';
import { Schema } from '../Schema';

export type InsertArgs<T extends keyof EntitieTypes._Entities> = {
  table: T;
  params: {
    [K in keyof GetCreate<EntitieTypes._Entities[T]>]:
      | GetCreate<EntitieTypes._Entities[T]>[K]
      | SubSelect;
  };
};

class Insert extends Query {
  constructor(schema: Schema) {
    super(schema);
  }

  public paramsArrayNumbers: Array<string> = [];

  public insert = <T extends keyof EntitieTypes._Entities>(
    args: InsertArgs<T>,
  ) => {
    let paramsArrayNames: Array<string> = [];
    let selStr = '';
    for (const param in args.params) {
      if (typeof args.params[param] === 'function') {
        //const subMSQL = new MakeSQL(this.db_schema_obj, this.getParamNumber)
        //@ts-ignore
        continue;
      } else {
        this.paramsArrayNumbers.push(
          `$${this.getParamNumber(args.params[param])}`,
        );
        paramsArrayNames.push(param);
      }
    }

    for (const param in args.params) {
      if (typeof args.params[param] === 'function') {
        //const subMSQL = new MakeSQL(this.db_schema_obj, this.getParamNumber)
        //@ts-ignore
        selStr += `\n ${
          //@ts-ignore
          args.params[param](this, this.paramsArrayNumbers).value
        }`;
        paramsArrayNames = [param, ...paramsArrayNames];
      }
    }

    if (!selStr) {
      selStr = `\nvalues(${this.paramsArrayNumbers.join(',')})`;
    }

    return `insert into "${args.table}" \n(${paramsArrayNames.join(
      ',',
    )}) ${selStr} \non conflict do nothing  \nreturning *`;
  };
}

export default Insert;
