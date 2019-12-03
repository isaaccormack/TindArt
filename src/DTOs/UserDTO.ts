import { IUserDataJSON } from "../services/IUserService";

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
  }
}
