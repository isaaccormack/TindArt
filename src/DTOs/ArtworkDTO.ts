import { IArtworkDataJSON } from "../services/IArtworkService";
import { GCP_URL } from "../services/GCPService";

/* ArtworkDTO object to transfer data between model and view */
export class ArtworkDTO {
  public _id: string = "";

  public userId: string = "";

  public photos: string[] = [];

  public title: string = "";

  public description: string = "";

  public price: number = 0.00;

  public units: string = "";

  public dimensions: number[] = [0, 0, 0];

  public city: string = "";

  public province: string = "";

  constructor(res: IArtworkDataJSON) {
    this.create(res);
  }

  public create(res: IArtworkDataJSON) {
    this._id = res._id.toString();
    this.userId = res.userId;
    this.title = res.title;
    this.description = res.description;
    this.price = res.price;
    this.units = res.units;
    this.dimensions = res.dimensions;
    this.city = res.city;
    this.province = res.province;
    // Remap photo ids from the database to the GCP urls
    this.photos = res.photos.map((p) => GCP_URL(p));
  }
}
