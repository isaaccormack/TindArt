import DbClient from "../DbClient";
import { ObjectId } from 'mongodb';
import { User } from "../models/User";
import { UserDataJSON } from "../DTOs/UserDTO";


export interface DbResult { // Type returned by insertNewUser
  // Types can be undefined so result can be falsey if error present and vice versa
  err: {
    type: string;
    message: string;
  } | undefined;
  result: UserDataJSON | undefined;
}

/**
 * Insert New User
 */
export async function insertNewUser(user: User, hash: string): Promise<DbResult> {
  return new Promise((resolve, reject) => {
    DbClient.connect()
      .then((db: any) => {
        return db.collection("users").insertOne({
          "name": user.getName(),
          "username": user.getUsername(),
          "email": user.getEmail(),
          "city": user.getCity(),
          "province": user.getProvince(),
          "password": hash,
        });
      })
      .then((result: any) => {
        // Add typing in here for result.ops
        if (result.ops.length != 1) { // User couldn't be created
          reject(Error("Database insert error"));
        }
        const userData: UserDataJSON = result.ops[0]; // Type the DB response
        resolve({ err: undefined, result: userData }); // err is falsey
      })
      .catch((err: any) => {
        if (err.code && parseInt(err.code, 10) === 11000) { // Username is not unique
          if (err.keyPattern.username) {
            resolve({ err: { type: "usernameError", message: "An account with this username already exists" }, result: undefined })
          } else if (err.keyPattern.email) {
            resolve({ err: { type: "emailError", message: "An account with this email already exists" }, result: undefined })
          }
        } else {
          err.message = "Database error";
          reject(err);
        }
      });
  });
}


/**
 * Find User by Email
 */
export async function findUserByEmail(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    DbClient.connect()
      .then((db: any) => {
        return db.collection("users").find({ email }).toArray();
      })
      .then((result: any) => {
        if (result.length != 1) {
          resolve(); // Couldn't find users email
        }
        resolve(result[0]);
      })
      .catch((err: any) => {
        err.message = "Database find error";
        reject(err);
      });
  });
}


/**
 * Find User by Username
 */
export async function findUserByUsername(username: string): Promise<UserDataJSON> {
  return new Promise((resolve, reject) => {
    DbClient.connect()
      .then((db: any) => {
        return db.collection("users").find({ username }).toArray();
      })
      .then((result: any) => {
        if (result.length != 1) {
          resolve(); // Couldn't find username
        }
        resolve(result[0]);
      })
      .catch((err: any) => {
        err.message = "Database find error";
        reject(err);
      });
  });
}


/**
 * Update User Bio by ID
 */
export async function updateUserBioByID(_id: string, bio: string): Promise<Boolean> {
  return new Promise((resolve, reject) => {
    DbClient.connect()
      .then((db: any) => {
        return db.collection("users").updateOne({ _id: new ObjectId(_id) }, { $set: { bio } });
      })
      .then((result: any) => {
        if (result.matchedCount != 1) {
          resolve(false); // Couldn't find id
        }
        resolve(true);
      })
      .catch((err: any) => {
        err.message = "Database update error";
        reject(err);
      });
  });
}