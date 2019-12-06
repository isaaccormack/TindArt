import { Service } from "./Service";
import { Db } from "mongodb";

export class DBService extends Service {
  private _db: Db;

  constructor(options: any) {
    super(options);
    if (!options.db) {
      throw new Error("db not defined.");
    }
    this._db = options.db;
  }

  get db(): Db {
    if (!this._db) {
      throw new Error("db has not been initialized.");
    }
    return this._db;
  }
}
