import { ILikeDataJSON } from "../services/ILikeService";

/**
 * LikeDTO encapsulates the data of a user that has "liked" an artwork.
 * In particular, it is the data representation sent to the templating engine
 * (view) after converting it from the database (model) representation.
 */
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
