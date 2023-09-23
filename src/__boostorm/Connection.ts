import { Pool } from 'pg';
import Transaction from './Transaction';
import Store from './Store';
export interface PGConfig {
  host: string;
  database: string;
  schema: string;
  user: string;
  password: string;
}

export type Executor = (
  query: string,
  params: Array<unknown>,
) => Promise<{ rows: Array<unknown>; rowCount: number }>;

class Connection {
  pool: Pool;

  static instanse: Connection;
  static getInstanse() {
    if (!Connection.instanse) {
      return new Connection();
    } else {
      return Connection.instanse;
    }
  }

  public init() {
    const config = Store.getConfig();
    const connectionString = `postgres://${config.connection.user}:${config.connection.password}@${config.connection.host}:${config.connection.port}/${config.connection.database}`;
    //console.log(connectionString);
    try {
      this.pool = new Pool({ connectionString });
    } catch (err) {
      const e = err as Error;
      console.log(e.message);
    }
  }

  public execute: Executor = async (query, params) => {
    try {
      console.log(query)
      console.log(params)
      const res = await this.pool.query(query, params);
      return res;
    } catch (err) {
      const e = err as Error;
      console.log(e);
      throw e;
    }
  };

  private openTransaction = async (): Promise<Transaction> => {
    const client = await this.pool.connect();
    return new Transaction({ client });
  };

  public runTransaction = async <T>(
    core: (c: Transaction) => Promise<T>,
  ): Promise<T> => {
    const tr = await this.openTransaction();
    try {
      await tr.execute('BEGIN');
      const res = await core(tr);
      await tr.commit();
      return res;
    } catch (err) {
      const e = err as Error;
      console.log(e.message);
      await tr.rollback();
      throw e;
    } finally {
      tr.close();
    }
  };
}

export default Connection.getInstanse();
