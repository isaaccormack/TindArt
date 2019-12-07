import { Db } from "mongodb";

/**
 * DBService is a base class for our services that require database access.
 * By using this, we simplify and unify access to the database across
 * all of our services.
 */
export class DBService {
  private _db: Db;

  constructor(options: any) {
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
