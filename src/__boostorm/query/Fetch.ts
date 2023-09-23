import Query from '../QueryBuilder';
import { WhereParams, Join, Order } from '../common';
import * as EntitieTypes from '../entities';
import { Schema } from '../Schema';
import { makeTableType } from '../utils/makeTableType';
import { makeFieldType } from '../utils/makeFieldType';

export type FetchArgs<T extends keyof EntitieTypes._Entities> = {
  table: T;
  select?:
    | keyof EntitieTypes._Entities[T]['entitie']
    | Array<keyof EntitieTypes._Entities[T]['entitie']>;
  selectConstans?: Array<string>;
  where?: WhereParams<T> | Array<WhereParams<T>>;
  join?:
    | Join<EntitieTypes._Entities[T]['joins']>
    | Array<Join<EntitieTypes._Entities[T]['joins']>>;
  limit: number | 'infinity';
  offset: number;
  orderBy?: Order<T>;
};

class Fetch extends Query {
  constructor(schema: Schema, paramsShift?: number) {
    super(schema, paramsShift);
  }
  private returnType: object = {};

  private processFetch(args: any) {
    const argument = args as any;

    if (argument.select && !Object.keys(this.returnType).length) {
      if (Array.isArray(argument.select)) {
        for (const s of argument.select) {
          this.returnType[s] = s;
        }
      } else {
        this.returnType[argument.select] = argument.select;
      }
    }
    if (!argument.select && !Object.keys(this.returnType).length) {
      const cols = this.schema.getColumnsOfTable(argument.table);
      if (cols) {
        for (const c of cols) {
          this.returnType[c] = c;
        }
      }
    }
    if (argument.join) {
      if (Array.isArray(argument.join)) {
        for (const j of argument.join) {
          const tableName = j.table;
          const select = j.select;
          const columns = this.schema.getColumnsOfTable(tableName);
          if (columns && select) {
            this.returnType[j.table] = { [select]: columns };
          }
          this.processFetch(j);
        }
      } else {
        const tableName = argument.join.table;
        const select = argument.join.select;
        const columns = this.schema.getColumnsOfTable(tableName);
        if (columns && select) {
          this.returnType[argument.join.table] = { [select]: columns };
        }

        this.processFetch(argument.join);
      }
    }
    //console.log(this.returnType)
    return this.returnType;
  }

  public generateReturnType(args: any) {
    this.table = args.table;
    let returnType = '\n{\n';

    const rootTableName = this.table;
    const prototype = this.processFetch(args);

    for (const p in prototype) {
      if (typeof prototype[p] === 'string') {
        if (rootTableName) {
          const column = this.schema.findColumn(
            rootTableName,
            prototype[p] as string,
          );
          if (column) {
            returnType += `\n${this.schema.genTypeFromColumn(column)}`;
          }
        }
      }
    }
    for (const p in prototype) {
      if (typeof prototype[p] === 'object') {
        const joinedTable = p;
        const fieldNames = Object.keys(prototype[p]);
        if (Array.isArray(prototype[p][fieldNames[0]])) {
          const joinedTypename = makeTableType(joinedTable);
          returnType += `\n${fieldNames[0]}: Array<${joinedTypename}>`;
          this.pushTableType(joinedTable);
        } else {
          for (const f of fieldNames) {
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
      }
    }
    returnType += '\n}';

    // console.log(returnType)
    return { type: returnType, tables: this.tableTypesToBuild };
  }

  public fetch = <T extends keyof EntitieTypes._Entities>(
    args: FetchArgs<T>,
  ): string => {
    this.table = args.table;

    if (!args.select) {
      this.selectString = `${this.table}.*`;
    } else {
      if (Array.isArray(args.select)) {
        let sindex = 0;
        for (const s of args.select) {
          this.selectString += `${sindex ? '' : '\n'}${this.table}.${s as string}`;
          sindex++;
        }
      } else {
        this.selectString += `${this.table}.${args.select as string}`;
      }
    }

    if (args.selectConstans) {
      for (const sc of args.selectConstans) {
        this.selectString += `${',\n'}${sc}`;
      }
    }

    const foundTable = this.schema.getTableByName(args.table);
    if (foundTable) {
      this.primary_key = foundTable.primary_key;
    }

    if (args.where) {
      this.addWhereString(args.where, this.table);
    }
    if (args.join) {
      this.addJoinString(args.join, this.table);
    }
    if (args.orderBy) {
      this.addOrderBy(args.orderBy);
    }

    if (this.whereString) {
      this.whereString = `\nwhere` + this.whereString;
    }

    if (this.joinString) {
      this.groupByString = `\ngroup by ${this.table}.${this.primary_key}`;
    }

    if (args.orderBy) {
      this.orderByString = `\norder by ${this.orderByString}`;
    }

    return `select ${this.selectString} \nfrom ${this.table}${this.joinString}${
      this.whereString
    }${this.groupByString}${this.orderByString} ${
      args.limit !== 'infinity'
        ? `\nlimit $${this.getParamNumber(args.limit)}`
        : ''
    } \noffset $${this.getParamNumber(args.offset)}`;
  };
}

export default Fetch;
