import { Service } from "./Service";
import { ObjectId, Db } from "mongodb";

export class DBService extends Service {
  private static _db: Db;

  static get db(): Db {
    if (!DBService._db) {
      throw new Error("Db has not been initialized. Call initService first.");
    }
    return DBService._db;
  }

  public static initService(options: any): void {
    if (!options.db) {
      throw new Error("db not defined");
    }
    DBService._db = options.db;
  }

}
