import { IsAlphanumeric, IsLength } from "validator.ts/decorator/Validation";

/* Photo object to validate user input */
export class Photo {
  @IsAlphanumeric({
    message: "_id must be alphanumeric"
  })
  @IsLength(1, 16)
  private userId: string = "";

  constructor(photoData: any) {
    this.create(photoData);
  }

  public create(photoData: any) {
    this.userId = photoData.userId;
  }

  public getUserId(): string { return this.userId; }
}
