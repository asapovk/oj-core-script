import Insert from './query/Insert';
import Update from './query/Update';
import Select from './query/Select';
import Fetch from './query/Fetch';
import Delete from './query/Delete';

import { InsertArgs } from './query/Insert';
import { UpdateArgs } from './query/Update';
import { FetchArgs } from './query/Fetch';
import { SelectArgs } from './query/Select';
import SelectUnsafe, { SelectUnsafeArgs } from './query/SelectUnsafe';
import SelectWith, { SelectWithArgs } from './query/SelectWith';
import { Root } from './decorator/Root';
import schema, { Schema } from './Schema';
import Store from './Store';

import EntitieTypes from './entities';
import { DeleteArgs } from './query/Delete';

export interface RepositoryOpts {
  executor: (
    query: string,
    params: Array<unknown>,
  ) => Promise<{ rows: Array<unknown>; rowCount: number }>;
  schema: Schema;
}

class Repository {
  private opts: RepositoryOpts;
  constructor(opts: RepositoryOpts) {
    this.opts = opts;
  }
  public generatedType = '';

  @Root('Insert')
  public async insert<T extends keyof EntitieTypes._Entities>(
    args: InsertArgs<T>,
  ) {
    const qs = new Insert(this.opts.schema);
    const res = await this.opts.executor(qs.insert(args), qs.getParams());
    return res.rows[0] as any;
  }

  @Root('Update')
  public async update<T extends keyof EntitieTypes._Entities>(
    args: UpdateArgs<T>,
  ) {
    const qs = new Update(this.opts.schema);
    const res = await this.opts.executor(qs.update(args), qs.getParams());
    return res.rowCount as number;
  }

  public async delete<T extends keyof EntitieTypes._Entities>(
    args: DeleteArgs<T>,
  ) {
    const qs = new Delete(this.opts.schema);
    const res = await this.opts.executor(qs.delete(args), qs.getParams());
    return res.rowCount as number;
  }

  @Root('Fetch')
  public async fetch<T extends keyof EntitieTypes._Entities>(
    args: FetchArgs<T>,
  ) {
    const qs = new Fetch(this.opts.schema);
    const res = await this.opts.executor(qs.fetch(args), qs.getParams());
    return res.rows as any;
  }

  @Root('Select')
  public async select<
    T extends keyof EntitieTypes._Entities,
    L extends keyof EntitieTypes._Entities[T]['entitie'],
    M extends keyof EntitieTypes._Entities[T]['entitie'],
    A extends {
      [key in keyof EntitieTypes._Entities]: EntitieTypes._Entities[key];
    },
  >(args: SelectArgs<T, L, M, A>) {
    const qs = new Select(this.opts.schema);
    const res = await this.opts.executor(qs.select(args), qs.getParams());
    return res.rows as any;
  }

  @Root('SelectUnsafe')
  public async selectUnsafe<
    Type extends object,
    M extends keyof Type,
    L extends keyof Type,
    A extends {
      [key in keyof EntitieTypes._Entities]: EntitieTypes._Entities[key];
    },
  >(type: Type, args: SelectUnsafeArgs<Type, M, L, A>) {
    const qs = new SelectUnsafe(this.opts.schema);
    const res = await this.opts.executor(
      qs.selectUnsafe(type)(args),
      qs.getParams(),
    );
    return res.rows as any;
  }

  @Root('SelectWith')
  public async selectWith<
    T extends { [key: string]: (a: any) => unknown },
    K extends keyof T,
  >(args: SelectWithArgs<T, K>) {
    const qs = new SelectWith(this.opts.schema);
    const res = await this.opts.executor(qs.selectWith(args), qs.getParams());
    return res.rows as any;
  }
}

export default Repository;
