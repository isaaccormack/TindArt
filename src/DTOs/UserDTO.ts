import { IUserDataJSON } from "../services/IUserService";
import { GCP_URL } from "../services/GCPService";

/**
 * UserDTO encapsulates a single user's data.
 * In particular, it is the data representation sent to the templating engine
 * (view) after converting it from the database (model) representation.
 */
export class UserDTO {
  public bio: string = "";

  public name: string = "";

  public username: string = "";

  public email: string = "";

  public city: string = "";

  public province: string = "";

  public _id: string = "";

  public photoURLs: string[] = [];

  public phoneNumber: string = "";

  public avatar: string = "";

  constructor(res: IUserDataJSON) {
    this.create(res);
  }

  public create(res: IUserDataJSON) {
    this.bio = res.bio;
    this.name = res.name;
    this.username = res.username;
    this.email = res.email;
    this.city = res.city;
    this.province = res.province;
    this._id = res._id;
    this.phoneNumber = res.phoneNumber;
    this.avatar = GCP_URL(this.username) + "?" + Math.round(new Date().getTime() / 1000);
  }
}
