import { IPhotoDataJSON } from "../services/IPhotoService";

const BUCKET_NAME = "majabris";

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
    this.url = `https://storage.googleapis.com/${BUCKET_NAME}/${this._id}`;
  }
}
