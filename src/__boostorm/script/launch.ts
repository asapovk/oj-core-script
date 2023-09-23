//import * as Repos from '../../repository/repository/index'
import Connection, { Executor } from '../Connection';
import rtg from './ReturnTypeGenerator';
import schema, { Schema } from '../Schema';
import Store from '../Store';

const getExecutor =
  (debug?: boolean): Executor =>
  (query: string, params: Array<unknown>) => {
    if (debug) {
      console.log('%cDEBUG MODE', 'color:blue;');
      console.log(query);
      console.log(params);
    }
    else {Connection.execute(query, params).then(res => {
        // console.log(res.rows)
    })}
    return {
      rows: [],
      rowCount: 0,
    } as unknown as Promise<{ rows: Array<unknown>; rowCount: number }>;
  };

export async function launch(debug?: boolean) {
  const Repos = await import(`../../${Store.getConfig().repositoryPath}/index`);

  for (const R in Repos) {
    const r = new Repos[R]({
      executor: getExecutor(debug), //Connection.execute,
      schema,
    });
    rtg.runMethods(r, debug);
  }
  if (!debug) {
    rtg.genTypes();
  }
}
