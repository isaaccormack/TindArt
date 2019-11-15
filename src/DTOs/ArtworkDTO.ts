/* Type interface for the returned JSON for artwork sent to or returned by DB query */
export interface ArtworkDataJSON {
  userId: string;
  photoIds: string[];
  title: string;
  description: string;
  price: number;
  dimensions: number[];
  _id: string;
}

/* ArtworkDTO object to transfer data between model and view */
export class ArtworkDTO {
  public userId: string = "";

  public photoIds: string[] = [];

  public title: string = "";

  public description: string = "";

  public price: number = 0.00;

  public dimensions: number[] = [0, 0, 0];

  public _id: string = "";

  constructor(res: ArtworkDataJSON) {
    this.create(res);
  }

  public create(res: ArtworkDataJSON) {
    this.userId = res.userId;
    this.photoIds = res.photoIds;
    this.title = res.title;
    this.description = res.description;
    this.price = res.price;
    this.dimensions = res.dimensions;
    this._id = res._id;
  }
}
