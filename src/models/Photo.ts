import { IsAlphanumeric, IsLength } from "validator.ts/decorator/Validation";

/* User object to validate user input */
export class Photo {
  @IsAlphanumeric({
    message: "_id must be alphanumeric"
  })
  @IsLength(1, 16)
  private userId: string = "";

  public create(photoData: any) {
    this.userId = photoData.userId;
  }

  public getUserId(): string { return this.userId; }
}
