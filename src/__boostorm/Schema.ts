import { Executor } from './Connection';
import { makeTableType } from './utils/makeTableType';
export interface Column {
  column_name: string;
  data_type: string;
  is_nullable: 'YES' | 'NO';
  column_default: string | null;
  table_name: string;
}

export interface Table {
  table_name: string;
  columns: Array<Column>;
  joins: Array<string>;
  primary_key: string;
  joinsColums: Array<{
    table_name: string;
    left_column: string;
    right_column: string;
  }>;
}

const dbSchema = require('./dbSchema.json');

export class Schema {
  db_shema: Array<Table>;

  constructor(db_shema: Array<any>) {
    this.db_shema = db_shema;
  }

  public getDTSFromTableName(tableName: string): string {
    const table = this.db_shema.find((t) => t.table_name === tableName);
    if (!table) {
      return '';
    }

    const typename = makeTableType(table.table_name);

    const begining = `interface ${typename} {`;
    let middle = '';
    for (const col of table.columns) {
      middle += `\n${this.genTypeFromColumn(col)}`;
    }
    const end = `\n}`;

    return `${begining}${middle}${end}`;
  }

  public getDTS(table: Table): string {
    const typename = makeTableType(table.table_name);

    const begining = `\nexport interface _${typename} {`;
    let middle = '';
    for (const col of table.columns) {
      middle += `\n${this.genTypeFromColumn(col)}`;
    }
    const end = `\n}`;

    return `${begining}${middle}${end}`;
  }

  public getColumnsOfTable(tableName: string): Array<string> | null {
    const table = this.db_shema.find((t) => t.table_name === tableName);
    if (table) {
      return table.columns.map((t) => t.column_name);
    }
    return null;
  }

  public getTableByName(tableName: string): Table | null {
    const table = this.db_shema.find((t) => t.table_name === tableName);
    if (table) {
      return table;
    }
    return null;
  }

  public findColumn(tableName: string, columnName: string): Column | null {
    const table = this.db_shema.find((t) => t.table_name === tableName);
    if (table) {
      const column = table.columns.find((t) => t.column_name === columnName);
      if (column) {
        return column;
      }
    }
    return null;
  }

  public genTypeFromColumn(col: Column, as?: string): string {
    let type;
    let is_null = '';

    if (col.data_type === 'text' || col.data_type.includes('character')) {
      type = 'string';
    }

    if (col.data_type.includes('timestamp')) {
      type = 'Date';
    }

    if (
      col.data_type === 'integer' ||
      col.data_type === 'smallint' ||
      col.data_type === 'bigint' ||
      col.data_type === 'real'
    ) {
      type = 'number';
    }

    if (col.data_type === 'boolean') {
      type = 'boolean';
    }

    if (col.data_type.includes('json')) {
      type = 'JSON';
    }

    if (col.is_nullable === 'YES') {
      is_null = '| null';
    }

    return `${as || col.column_name}: ${type} ${is_null}`;
  }
}

export default new Schema(dbSchema);
