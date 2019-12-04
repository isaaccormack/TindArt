import { IPhotoDataJSON } from "../services/IPhotoService";
import { GCP_URL } from "../services/GCPService";

/* PhotoDTO object to transfer data between model and view */
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
