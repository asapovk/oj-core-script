import schema, { Table, Schema } from '../Schema';
import fs from 'fs';
import { makeTableType } from '../utils/makeTableType';
import { makeFieldType } from '../utils/makeFieldType';
import Select from '../query/Select';
import SelectUnsafe from '../query/SelectUnsafe';
import SelectWith from '../query/SelectWith';
import Fetch from '../query/Fetch';
import Store from '../Store';
import path from 'path';
const dbSchema = require('../dbSchema.json');
export interface RTypeGeneratorOpts {
  schema: Schema;
}

interface FetchReturnPrototype {
  [key: string]: string | { [key: string]: string | Array<string> };
}

class ReturnTypeGenerator {
  static instanse: ReturnTypeGenerator | null = null;
  static getInstanse() {
    if (!this.instanse) {
      this.instanse = new ReturnTypeGenerator({ schema: new Schema(dbSchema) });
      return this.instanse;
    } else return this.instanse;
  }

  private opts: RTypeGeneratorOpts;
  constructor(opts: RTypeGeneratorOpts) {
    this.opts = opts;
  }

  private lastCall: 'root' | 'r' = 'root';

  private Rmethods: Array<{ f: string; args: any; debug?: boolean }> = [];

  private args: Array<{ args: any; root: string }> = [];

  private tableTypesToBuild: Array<string> = [];

  private pushTableType = (tableName: string) => {
    if (!this.tableTypesToBuild.includes(tableName)) {
      this.tableTypesToBuild.push(tableName);
    }
  };

  public call() {
    if (this.lastCall === 'r') {
      this.lastCall = 'root';
    } else {
      this.lastCall = 'r';
    }
  }

  private generateReturnType(args, root) {
    if (root === 'Fetch') {
      const qs = new Fetch(this.opts.schema);
      return qs.generateReturnType(args[0]);
    }
    if (root === 'Select') {
      const qs = new Select(this.opts.schema);
      return qs.generateReturnType(args[0]);
    }
    if (root === 'SelectUnsafe') {
      const qs = new SelectUnsafe(this.opts.schema);
      return qs.generateReturnType(args[1], args[0]);
    }
    if (root === 'SelectWith') {
      const qs = new SelectWith(this.opts.schema);
      return qs.generateReturnType(args[0]);
    } else
      return {
        type: '',
        tables: [],
      };
  }

  public genTypes() {
    let tdsString = '';
    let index = 0;
    for (const m of this.Rmethods) {
      const returnTypename = makeTableType(m.f) + 'Return';
      const args = this.args[index].args;
      const root = this.args[index].root;
      const returnTypeString = this.generateReturnType(args, root as 'Fetch');
      if (returnTypeString) {
        tdsString += '\n';
        tdsString += `\nexport interface ${returnTypename} ${returnTypeString.type}`;
        for (const t of returnTypeString.tables) {
          this.pushTableType(t);
        }
      }
      index++;
    }
    for (const t of this.tableTypesToBuild) {
      tdsString += '\n\n';
      const tableType = this.opts.schema.getDTSFromTableName(t);
      tdsString += tableType;
    }

    fs.writeFileSync(
      path.join(
        __dirname,
        `../../${Store.getConfig().returnPath}`,
        'return.d.ts',
      ),
      tdsString,
      'utf-8',
    );
  }

  public pushRmethod = (args: { f: string; args: any; debug?: boolean }) => {
    this.Rmethods.push(args);
    // if (this.lastCall === 'r') {
    //     this.pushArgs({ args: {}, root: 'no root call' })
    // }
  };

  public pushArgs(params: { args: any; root: string }) {
    // this.call()
    this.args.push(params);
  }

  public runMethods(o: any, debug?: boolean) {
    for (const m of this.Rmethods) {
      if (!debug) {
        if (o[m.f]) {
          o[m.f](m.args);
        }
      } else {
        if (o[m.f] && m.debug) {
          o[m.f](m.args);
        }
      }
    }
  }
}

export default ReturnTypeGenerator.getInstanse();
