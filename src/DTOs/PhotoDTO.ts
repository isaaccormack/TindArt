/* Type interface for the returned JSON for photo returned by DB query */
export interface PhotoDataJSON {
    _id: string;
    user: string;
    url: string;
}
const BUCKET_NAME = "majabris";

  /* PhotoDTO object to transfer data between model and view */
export class PhotoDTO {
    public _id: string = "";
    public userId: string = "";
    public url: string = "";

    public create(res: PhotoDataJSON) {
      this.userId = res.user;
      this._id = res._id.toString();
      this.url = `https://storage.googleapis.com/${BUCKET_NAME}/${this._id}`;
    }
  }
