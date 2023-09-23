import Connection from './Connection';
import Store from './Store';
export * from './operator/Where';
export * from './operator/SubQuery';
export * from './operator/Join/JoinWhere';
export * from './operator/OrderBy/OrderBy';
export { default as Connection } from './Connection';
export { default as Schema } from './Schema';
export { default as Repository } from './Repository';
export * from './script/launch';
export { RepositoryOpts as RepositoryOpts } from './Repository';
export { Executor as Executor } from './Connection';
export * from './types';
export { Unique } from './utils/unique';
export const setConfig = (config) => {
  Store.setConfig(config);
};
export { Config as ConfigOpts } from './Store';

export const connect = () => {
  Connection.init();
};
