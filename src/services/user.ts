import { DbResult } from "./user";
import DbClient from "../DbClient";
import { ObjectId, Db } from "mongodb";
import { User } from "../models/User";
import { UserDataJSON } from "../DTOs/UserDTO";
import { getDb } from "../database/dal";

export interface DbResult { // Type returned by insertNewUser
  // Types can be undefined so result can be falsey if error present and vice versa
  err?: {
    type: string;
    message: string;
  };
  result?: UserDataJSON;
}

/**
 * Insert new User into database
 * @param user the User object to add to the users database
 * @param hash the password for the user
 * @return a Promise for a DbResult object, which contains either the UserDataJSON object
 * of the new user, or an error message. An error message is returned if the username or
 * email of the new user is not unique, i.e. already exists in the database.
 */
export async function insertNewUser(user: User, hash: string): Promise<DbResult> {
  const db: Db = getDb();
  try {
    const result = await db.collection("users").insertOne({
      "name": user.getName(),
      "username": user.getUsername(),
      "email": user.getEmail(),
      "city": user.getCity(),
      "province": user.getProvince(),
      "password": hash,
    });
    // User couldn't be created, but insertOne() did not throw
    if (result.ops.length !== 1) {
      throw new Error("Database insert error");
    }
    return { result: result.ops[0] as UserDataJSON }; // err is falsey; typecast db return value
  } catch (err) {
    if (err.code && parseInt(err.code, 10) === 11000) { // Something is not unique that needs to be
      if (err.keyPattern.username) { // username is not unique
        return { err: { type: "usernameError", message: "An account with this username already exists" } };
      } else { // implicitly err.keyPattern.email i.e. email is not unique
        return { err: { type: "emailError", message: "An account with this email already exists" } };
      }
    } else {
      err.message = "Database error";
      throw err;
    }
  }
}

/**
 * Find a User in the database by searching for its email
 * @param email User to search for
 * @return a Promise for either a UserDataJSON object containing the user's
 * data or null if the user does not exist
 */
export async function findUserByEmail(email: string): Promise<UserDataJSON | null> {
  const db: Db = getDb();
  try {
    const results = await db.collection("users").find({ email }).toArray();
    if (results.length !== 1) {
      return null; // Couldn't find email
    } else {
      return results[0]; // Found email
    }
  } catch (err) {
    err.message = "Database find error";
    throw err;
  }
}

/**
 * Find a User in the database by searching for its username
 * @param username User to search for
 * @return a Promise for either a UserDataJSON object containing the user's
 * data or null if the user does not exist
 */
export async function findUserByUsername(username: string): Promise<UserDataJSON | null> {
  const db: Db = getDb();
  try {
    const results = await db.collection("users").find({ username }).toArray();
    if (results.length !== 1) {
      return null; // Couldn't find username
    } else {
      return results[0]; // Found username
    }
  } catch (err) {
    err.message = "Database find error";
    throw err;
  }
}

/**
 * Update a User's Bio by searching for its ID
 * @param _id User ID to search for
 * @param bio Updated Bio contents
 * @return a Promise with a boolean success/failure value
 */
export async function updateUserBioByID(_id: string, bio: string): Promise<boolean> {
  const db: Db = getDb();
  try {
    const result = await db.collection("users").updateOne({ _id: new ObjectId(_id) }, { $set: { bio } });
    if (result.matchedCount !== 1) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    err.message = "Database update error";
    throw err;
  }
}
