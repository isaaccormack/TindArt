import { PhotoDataJSON } from "../DTOs/PhotoDTO";

/* Type interface for the returned JSON for user returned by DB query */
export interface UserDataJSON {
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

/* UserDTO object to transfer data between model and view */
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

  /**
   * Could add these later:
   * Phone number
   * Personal Website
   * Social media links - facebook, twitter, etc.
   */
  constructor(res: UserDataJSON) {
    this.create(res);
  }

  public create(res: UserDataJSON) {
    this.bio = res.bio;
    this.name = res.name;
    this.username = res.username;
    this.email = res.email;
    this.city = res.city;
    this.province = res.province;
    this._id = res._id;
    this.phoneNumber = res.phoneNumber;
  }
}
