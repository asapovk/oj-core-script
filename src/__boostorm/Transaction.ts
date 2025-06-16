import { PoolClient } from 'pg';

export interface TransactionOpts {
  client: PoolClient;
}

export class Transaction {
  client: PoolClient;

  constructor(opts: TransactionOpts) {
    this.client = opts.client;
  }

  public execute = async (query: string, params?: Array<unknown>) => {
    //console.log(query);
    //console.log(params);
    return await this.client.query(query, params);
  };

  public close = () => {
    this.client.release();
  };

  public commit = async () => {
    await this.client.query('COMMIT');
  };

  public rollback = async () => {
    await this.client.query('ROLLBACK');
  };
}

export default Transaction;
