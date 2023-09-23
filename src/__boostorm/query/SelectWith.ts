import QueryBuilder from '../QueryBuilder';
import { GetSelectedFields } from '../common';
import * as EntitieTypes from '../entities';
import { Schema } from '../Schema';
import { makeTableType } from '../utils/makeTableType';
import { makeFieldType } from '../utils/makeFieldType';

export type SelectWithArgs<
  T extends { [key: string]: (a: any) => unknown },
  K extends keyof T,
> = {
  with: T;
  select: {
    from: K;
    join: {
      [M in keyof T]?: {
        on: {
          left: GetSelectedFields<ReturnType<T[K]>>;
          operator: '<' | '>' | '=' | '!=' | '<=' | '>=';
          right: GetSelectedFields<ReturnType<T[M]>>;
        };
      };
    };
  };
};

class SelectWith extends QueryBuilder {
  constructor(schema: Schema, paramsStartPosition?: number) {
    super(schema, paramsStartPosition);
  }

  private withString = '';

  private genetateRetunObj = <
    T extends { [key: string]: (a: any) => unknown },
    K extends keyof T,
  >(
    args: SelectWithArgs<T, K>,
  ) => {
    let returnObj: Object = {};
    for (const s in args.with) {
      //@ts-ignore
      const tableName = args.with[s](this).inputArgs.from;
      this.returnType = {};
      returnObj = {
        ...returnObj,
        ...{
          //@ts-ignore
          [tableName]: this.generateReturnForWith(args.with[s](this).inputArgs),
        },
      };
    }
    //console.log(returnObj)
    return returnObj;
  };

  private returnType: object = {};

  private generateReturnForWith(argument: any) {
    if (argument.select && argument.select.columns) {
      const rootSelectCols = argument.select.columns;
      for (const c of rootSelectCols) {
        this.returnType[c as string] = c as string;
      }
    }
    if (argument.select && argument.select.count) {
      this.returnType[argument.select.count as string] = argument.select
        .count as string;
    }
    if (argument.select && argument.select.sum) {
      this.returnType[argument.select.sum as string] = argument.select
        .sum as string;
    }
    if (argument.select && argument.select.dateTrunc) {
      this.returnType[argument.select.dateTrunc.col as string] = argument.select
        .dateTrunc.col as string;
    }

    if (argument.join) {
      for (const t in argument.join) {
        if (argument.join[t].aggregate) {
          this.returnType[t] = [t];
        } else if (argument.join[t].select) {
          for (const s of argument.join[t].select) {
            if (!this.returnType[t]) {
              this.returnType[t] = {
                [s]: s,
              };
            } else {
              this.returnType[t][s] = s;
            }
          }
        }
        this.generateReturnForWith(argument.join[t]);
      }
    }
    return this.returnType;
  }

  public generateReturnType(args: any) {
    this.table = args.select.from as string;

    let returnType = '\n{\n';
    const prototype = this.genetateRetunObj(args);

    for (const p in prototype) {
      const joinedTable = p;
      const fieldNames = Object.keys(prototype[p]);

      for (const f of fieldNames) {
        if (Array.isArray(prototype[p][f])) {
          const joinedTypename = makeTableType(prototype[p][f][0]);
          returnType += `\n${makeFieldType(
            p,
            f,
          )}: Array<${joinedTypename} | null>`;
          this.pushTableType(prototype[p][f][0]);
        } else {
          const column = this.schema.findColumn(
            joinedTable,
            prototype[p][f] as string,
          );
          if (column) {
            const joinedTypename = makeFieldType(joinedTable, prototype[p][f]);
            returnType += `\n${this.schema.genTypeFromColumn(
              column,
              joinedTypename,
            )}`;
          }
        }
      }
    }
    returnType += '\n}';

    return { type: returnType, tables: this.tableTypesToBuild };
  }

  public selectWith = <
    T extends { [key: string]: (a: any) => unknown },
    K extends keyof T,
  >(
    args: SelectWithArgs<T, K>,
  ) => {
    this.table = args.select.from as string;
    const colsMap = {};

    let windex = 0;
    for (const s in args.with) {
      //@ts-ignore
      const subselectReturn = args.with[s](this);
      //@ts-ignore
      const selStr = `${!windex ? 'with' : ',\n'} ${s} as (\n${
        //@ts-ignore
        subselectReturn.value
      }\n)`;
      //@ts-ignore
      colsMap[s] = subselectReturn.selectColsMap;
      this.withString += selStr;
      windex += 1;
    }

    //@ts-ignore
    this.addJoinString_for_selectWith(args.select.join, this.table, colsMap);

    return `${this.withString}\nselect * from ${args.select.from as string} ${this.joinString}`;
  };
}

export default SelectWith;
