import { User } from "../models/User";

export interface IUserService {
  insertNewUser(user: User, hash: string): Promise<IUserResult>;
  findOneUserByAttr(attr: string, val: string): Promise<IUserResult>;
  updateUserAttrByID(_id: string, attr: string, val: string): Promise<boolean>;
}

export interface IUserResult { // Type returned by insertNewUser
  // Types can be undefined so result can be falsey if error present and vice versa
  err?: {
    type: string;
    message: string;
  };
  result?: IUserDataJSON;
}

/* Type interface for the returned JSON for user returned by DB query */
export interface IUserDataJSON {
  bio: string;
  name: string;
  username: string;
  email: string;
  city: string;
  province: string;
  password: string;
  _id: string;
  phoneNumber: string;
}
