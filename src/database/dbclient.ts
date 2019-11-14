import { MongoClient, MongoError, Db } from "mongodb";
import assert from "assert";

let db: Db;

/**
 * Initialize database connection.
 * Calls the passed callback only once the database is connected - so
 * this should be (and is, in bin/www) called with server.listen() as the
 * callback. This way, the (singular) database connection is available
 * synchonously throughout the life of the server.
 */
export function initDb(callback: (err: MongoError | null, db: Db | undefined) => void): void {
  if (db) {
    return callback(null, db);
  }

  function onConnected(err: MongoError, client: MongoClient) {
    if (err) {
      return callback(err, undefined);
    }
    db = client.db("myapp");
    return callback(null, db);
  }

  MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, onConnected);
}

/**
 * Access the (singular) database connection.
 * Requires initDb() to have been called first.
 */
export function getDb(): Db {
  assert.ok(db, "Db has not been initialized. Call initDb first.");
  return db;
}
