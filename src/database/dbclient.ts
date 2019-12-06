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
export function initDb(connString: string, dbName: string, callback: (err: Error | null, db: any) => void): void {
  if (db) {
    return callback(new Error("Cannot initialize database twice"), undefined);
  }

  function onConnected(err: MongoError, client: MongoClient) {
    if (err) {
      return callback(err, undefined);
    }
    db = client.db(dbName);
    db.collection("users").createIndex({ "username" : 1 }, { unique: true });
    db.collection("users").createIndex({ "email" : 1 }, { unique: true });
    db.collection("likes").createIndex({ "userId" : 1, "artworkId": 1 }, { unique: true });
    return callback(null, {db, client});
  }

  MongoClient.connect(connString, { useUnifiedTopology: true }, onConnected);
}

/**
 * Access the (singular) database connection.
 * Requires initDb() to have been called first.
 */
export function getDb(): Db {
  assert.ok(db, "Db has not been initialized. Call initDb first.");
  return db;
}
