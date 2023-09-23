import QueryBuilder from '../QueryBuilder';
import {
  WhereUnsafe,
  OrderUnsafe,
  WhereParams,
  GetNames,
  GetNumbers,
  GetObject,
  GetDates,
  GetKeyOfEnt,
  GetEntit,
} from '../common';
import * as EntitieTypes from '../entities';
import { Schema } from '../Schema';
import { makeFieldType } from '../utils/makeFieldType';
import { makeTableType } from '../utils/makeTableType';

export type SelectUnsafeArgs<
  Type extends object,
  M extends keyof Type,
  L extends keyof Type,
  A extends {
    [key in keyof EntitieTypes._Entities]: EntitieTypes._Entities[key];
  },
> = {
  from: {
    sql: string;
    as: string;
  };
  select: {
    columns: Array<L>;
    sum?: GetNames<GetNumbers<GetObject<Type, M>>>;
    count?: GetNames<GetNumbers<GetObject<Type, M>>>;
    dateTrunc?: {
      col: GetNames<GetDates<GetObject<Type, M>>>;
      datepart:
        | 'year'
        | 'quarter'
        | 'month'
        | 'week'
        | 'day'
        | 'hour'
        | 'minute'
        | 'second'
        | 'milliseconds';
    };
  };
  where?: WhereUnsafe<Type> | Array<WhereUnsafe<Type>>;
  join?: {
    [U in keyof A]?: {
      on: {
        left: GetNames<Type>;
        operator: '<' | '>' | '=' | '!=' | '<=' | '>=';
        right: GetNames<GetEntit<A[U]>>;
      };
      where?: WhereParams<GetKeyOfEnt<U>>;
      select?: Array<GetNames<GetEntit<A[U]>>>;
      //aggregate?: 'count' | 'json_agg'
      join?: {
        [X in keyof A]?: {
          on: {
            left: GetNames<GetEntit<A[U]>>;
            operator: '<' | '>' | '=' | '!=' | '<=' | '>=';
            right: GetNames<GetEntit<A[X]>>;
          };
          aggregate?: 'count' | 'json_agg';
          select?: Array<GetNames<GetEntit<A[X]>>>;
          where?: WhereParams<GetKeyOfEnt<X>>;
        };
      };
    };
  };
  limit: number | 'infinity';
  offset: number;
  orderBy?: OrderUnsafe<Type>;
};

class SelectUnsafe extends QueryBuilder {
  constructor(schema: Schema, paramsStartPosition?: number) {
    super(schema, paramsStartPosition);
  }

  private unsafeSQL = '';
  private type!: Object;

  private selectColsMap: object = {};
  public getSelectColsMap = () => {
    return this.selectColsMap;
  };

  private returnType: object = {};

  private genetateRetunObj(argument: any) {
    if (argument.select && argument.select.columns) {
      const rootSelectCols = argument.select.columns;
      for (const c of rootSelectCols) {
        this.returnType[c as string] = this.type[c] as string;
      }
    }
    if (argument.select && argument.select.count) {
      this.returnType[argument.select.count as unknown as string] = argument
        .select.count as unknown as string;
    }
    if (argument.select && argument.select.sum) {
      this.returnType[argument.select.sum as unknown as string] = argument
        .select.sum as unknown as string;
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
        this.genetateRetunObj(argument.join[t]);
      }
    }
    // console.log(returnType)
    return this.returnType;
  }

  public generateReturnType(args: any, type: object) {
    this.table = args.from.as; //args.from
    this.unsafeSQL = args.from.sql;
    this.type = type;
    let returnType = '\n{\n';
    const prototype = this.genetateRetunObj(args);
    for (const p in prototype) {
      if (typeof prototype[p] === 'object') {
        if (Array.isArray(prototype[p])) {
          const joinedTypename = makeTableType(prototype[p][0]);
          returnType += `\n${makeFieldType(
            this.table,
            prototype[p][0],
          )}: Array<${joinedTypename} | null>`;
          this.pushTableType(prototype[p][0]);
          continue;
        }

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
              const joinedTypename = makeFieldType(
                joinedTable,
                prototype[p][f],
              );
              returnType += `\n${this.schema.genTypeFromColumn(
                column,
                joinedTypename,
              )}`;
            }
          }
        }
      } else {
        returnType += `\n${makeFieldType(this.table, p)}: ${prototype[p]}`;
      }
    }

    returnType += '\n}';

    return { type: returnType, tables: this.tableTypesToBuild };
  }

  public selectUnsafe =
    <Type extends object>(type: Type) =>
    <
      M extends keyof Type,
      L extends keyof Type,
      A extends {
        [key in keyof EntitieTypes._Entities]: EntitieTypes._Entities[key];
      },
    >(
      args: SelectUnsafeArgs<Type, M, L, A>,
    ) => {
      this.table = args.from.as; //args.from
      this.unsafeSQL = args.from.sql;
      this.type = type;
      let sindex = 0;
      for (const s of args.select.columns) {
        this.selectString += `${!sindex ? '' : ',\n'}${
          this.table
        }.${s as string} as "${makeFieldType(this.table, s as string)}"`;
        this.selectColsMap[s as string] = makeFieldType(
          this.table,
          s as string,
        );
        if (args.select.count || args.select.sum) {
          this.pushGroupBYCols(`${this.table}.${s as string}`);
        }
        sindex++;
      }

      if (args.select.count) {
        this.selectString += this.selectString ? `,\n` : ' ';

        this.selectString += `count(${this.table}.${
          args.select.count as string
        }) as  "${makeFieldType(this.table, args.select.count as string)}"`;
      }

      if (args.select.sum) {
        this.selectString += this.selectString ? `,\n` : ' ';

        this.selectString += `sum(${this.table}.${
          args.select.sum as string
        }) as "${makeFieldType(this.table, args.select.sum as string)}"`;
      }

      if (args.select.dateTrunc) {
        this.selectString += this.selectString ? `,\n` : ' ';

        this.selectString += `date_trunk('${args.select.dateTrunc.datepart}', ${
          this.table
        }.${args.select.dateTrunc.col as string}) as "${makeFieldType(
          this.table,
          args.select.dateTrunc.col as string,
        )}"`;

        if (args.select.count || args.select.sum) {
          this.groupBYCols.push(`${args.select.dateTrunc.col as string}`);
        }
      }

      if (args.where) {
        this.addWhereString(args.where, this.table);
      }
      if (args.join) {
        this.addJoinString_for_selectWith(args.join as any, this.table);
      }
      if (args.orderBy) {
        this.addOrderBy(args.orderBy);
      }
      if (this.whereString) {
        this.whereString = `\nwhere` + this.whereString;
      }

      if (this.groupBYCols.length) {
        this.groupByString += `\ngroup by ${this.groupBYCols.join(', ')}`;
      }

      if (args.orderBy) {
        this.orderByString = `\norder by ${this.orderByString}`;
      }

      this.unsafeSQL = `( \n${this.unsafeSQL}\n) as ${this.table}`;

      return `select ${this.selectString} \nfrom ${this.unsafeSQL}   ${
        this.joinString
      }${this.whereString}${this.groupByString}${this.orderByString}${
        args.limit !== 'infinity'
          ? `\nlimit $${this.getParamNumber(args.limit)}`
          : ''
      }  \noffset $${this.getParamNumber(args.offset)}`;
    };
}

export default SelectUnsafe;
