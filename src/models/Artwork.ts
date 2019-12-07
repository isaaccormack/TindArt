import { IsLength, Matches, MinLength, IsFloat, IsIn } from "validator.ts/decorator/Validation";

/* Artwork object to validate artwork input during artwork upload */
export class Artwork {
  @IsLength(1, 32, {
    message: "Title must be between 1 and 32 characters"
  })
  private title: string = "";

  @IsLength(0, 250, {
    message: "Description must be less than 250 characters"
  })
  private description: string = "";

  // city & province are passed in from the user and have already been validated
  private city: string = "";
  private province: string = "";

  /* RegExp validates that user input a floating point number with 1 or 2 decimal
   * places, ensure that price is formatted before it is displayed back on UI */
  @Matches(RegExp("^(?:[0-9]{0,10}(?:.[0-9]{1,2})?|.[0-9]{1,2})$"))
  private price: string = "";

  @IsIn(["Inches", "Feet", "Millimeters", "Centimeters", "Meters"])
  private units: string = "";

  @MinLength(1, {
    message: ""
  })
  private depth: string = "";

  @IsFloat({ min: 0.0, max: 100000.0 })
  private width: string = "";

  @IsFloat({ min: 0.0, max: 100000.0 })
  private height: string = "";

  constructor(artworkData: any) {
    this.create(artworkData);
  }

  public create(artworkData: any) {
    this.title = artworkData.title;
    this.description = artworkData.description;
    this.city = artworkData.city;
    this.province = artworkData.province;
    this.price = artworkData.price;
    this.units = artworkData.units;
    if (!artworkData.depth || artworkData.depth.length === 0) {
      artworkData.depth = "0";
    }
    this.depth = artworkData.depth;
    this.width = artworkData.width;
    this.height = artworkData.height;
  }

  public getTitle(): string { return this.title; }
  public getDescription(): string { return this.description; }
  public getCity(): string { return this.city; }
  public getProvince(): string { return this.province; }
  public getPrice() { return this.price; }
  public getUnits() { return this.units; }
  public getDimensions() { return [this.width, this.height, this.depth]; }
}
