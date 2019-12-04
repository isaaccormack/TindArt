import { ILikeDataJSON } from "../services/ILikeService";

/* LikeDTO object to transfer data between model and view */
export class LikeDTO {
  public userId: string = "";

  public artworkId: string = "";

  public _id: string = "";

  constructor(res: ILikeDataJSON) {
    this.create(res);
  }

  public create(res: ILikeDataJSON) {
    this.userId = res.userId;
    this.artworkId = res.artworkId;
    this._id = res._id;
  }
}
