import { User } from "../models/User";
import { DBService } from "./DBService";
import { ObjectId } from "mongodb";
import { IUserService, IUserResult, IUserDataJSON } from "./IUserService";

export class UserService extends DBService implements IUserService {
  /**
   * Insert new User into database
   * @param user the User object to add to the users database
   * @param hash the password for the user
   * @return a Promise for a DbResult object, which contains either the UserDataJSON object
   * of the new user, or an error message. An error message is returned if the username or
   * email of the new user is not unique, i.e. already exists in the database.
   */
  public async insertNewUser(user: User, hash: string): Promise<IUserResult> {
    try {
      const result = await this.db.collection("users").insertOne({
        "name": user.getName(),
        "username": user.getUsername(),
        "email": user.getEmail(),
        "city": user.getCity(),
        "province": user.getProvince(),
        "password": hash,
      });
      // User couldn't be created, but insertOne() did not throw
      if (result.ops.length !== 1) {
        return { err: { type: "DBError", message: "Database insert error" } };
      }
      return { result: result.ops[0] as IUserDataJSON }; // err is falsey; typecast db return value
    } catch (err) {
      if (err.code && parseInt(err.code, 10) === 11000) { // Something is not unique that needs to be
        if (err.keyPattern.username) { // username is not unique
          return { err: { type: "usernameError", message: "An account with this username already exists" } };
        } else { // implicitly err.keyPattern.email i.e. email is not unique
          return { err: { type: "emailError", message: "An account with this email already exists" } };
        }
      } else {
        return { err: { type: "DBError", message: "Database error" } };
      }
    }
  }

  /**
   * Find a User in the database by searching for a unique user attribute such as email or username
   * @param attr Unique attribute to search by (ie. username, email, )
   * @param val Value of attribute
   * @return a Promise for either a UserDataJSON object containing the user's
   * data or null if the user does not exist
   */
  public async findOneUserByAttr(attr: string, val: string): Promise<IUserResult> {
    try {
      const results = await this.db.collection("users").find({ [attr]: val }).toArray();

      if (results.length !== 1) {
        // Couldn't find username
        return { err: { type: "NotFound", message: "User cannot be found" } };
      } else {
        return { result: results[0] as IUserDataJSON }; // err is falsey; typecast db return value
      }
    } catch (err) {
      return { err: { type: "DBError", message: "Database find error" } };
    }
  }

  /**
   * Update a User's attribute by searching for their ID
   * @param _id User ID to search for
   * @param attr an attribute to be updated
   * @param val the updated value of the attribute
   * @return a Promise with a boolean success/failure value
   */
  public async updateUserAttrByID(_id: string, attr: string, val: string): Promise<boolean> {
    try {
      const result = await this.db.collection("users")
                              .updateOne({ _id: new ObjectId(_id) }, { $set: { [attr]: val } });
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
}
