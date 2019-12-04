import { IsLength, IsAlpha, Matches, IsNumeric, IsIn, IsAlphanumeric, MinLength, MaxLength, MinNumber } from "validator.ts/decorator/Validation";

/* Artwork object to validate artwork input */
export class Artwork {
  @IsAlpha({
    message: "Title must be alphabetical"
  })
  @IsLength(3, 32, {
    message: "Title must be included, up to 32 characters"
  })
  private title: string = "";

  @IsLength(2, 250, {
    message: "Description must be included, up to 250 characters"
  })
  private description: string = "";

  // Pass in from the user and has already been validated
  private city: string = "";
  private province: string = "";

  @IsNumeric({
    message: "Price must be a number"
  })
  @MinNumber(0, {
    message: "Price must be a positive number"
  })
  private price: string = "";

  @IsNumeric({
    message: "Depth must be a number"
  })
  @MinNumber(0, {
    message: "Depth must be a positive number"
  })
  @MinLength(1, {
    message: ""
  })
  private depth: string = "";

  @IsNumeric({
    message: "Price must be a number"
  })
  @MinNumber(0, {
    message: "Price must be a positive number"
  })
  private width: string = "";

  @IsNumeric({
    message: "Height must be a number"
  })
  @MinNumber(0, {
    message: "Height must be a positive number"
  })
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
  public getProvinceCode(): string { return this.province; }
  // Map province code to province
  public getProvince(): string {
    return this.province;
  }
  public getPrice() { return this.price; }
  public getDimensions() { return [this.width, this.height, this.depth]; }
}
