import { IArtworkDataJSON } from "../services/IArtworkService";
import { S3_URL } from "../services/S3Service";

/**
 * ArtworkDTO encapsulates the data of a single artwork.
 * In particular, it is the data representation sent to the templating engine
 * (view) after converting it from the database (model) representation.
 */
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
    this.photos = res.photos.map((p) => S3_URL(p));
  }
}
