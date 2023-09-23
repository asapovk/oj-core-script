export interface Config {
  returnPath: string;
  repositoryPath: string;
  debug: boolean;
  connection: {
    user: string;
    database: string;
    password: string;
    host: string;
    port: number;
    ssl?: {
      ca: string;
    };
  };
}

class Store {
  private config!: Config;

  static instanse: Store;
  static getInstanse() {
    if (!Store.instanse) {
      return new Store();
    } else {
      return Store.instanse;
    }
  }
  public setConfig(config: Config) {
    this.config = config;
  }
  public getConfig() {
    return this.config;
  }
}

export default Store.getInstanse();
