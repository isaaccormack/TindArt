import { IPhotoDataJSON } from "../services/IPhotoService";
import { GCP_URL } from "../services/GCPService";

/**
 * PhotoDTO encapsulates a single photo's data.
 * In particular, it is the data representation sent to the templating engine
 * (view) after converting it from the database (model) representation.
 * Note: This is unused at present, because we generally send data to the
 * view via ArtworkDTOs, but it is left here for consistency.
 */
export class PhotoDTO {
  public _id: string = "";
  public userId: string = "";
  public url: string = "";

  constructor(res: IPhotoDataJSON) {
    this.create(res);
  }

  public create(res: IPhotoDataJSON) {
    this.userId = res.user;
    this._id = res._id.toString();
    this.url = GCP_URL(this._id);
  }
}
