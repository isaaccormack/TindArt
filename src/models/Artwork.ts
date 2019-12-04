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

  @IsAlpha({
    message: "City must be alphabetical"
  })
  @IsLength(2, 32, {
    message: "City must be between 2 and 32 characters"
  })
  private city: string = "";

  @IsNumeric({
    message: "Province code must be numeric"
  })
  /* Province codes are defined in the following http://geogratis.gc.ca/services/geoname/en/codes/province */
  @IsIn(["10", "11", "12", "13", "24", "35", "46", "47", "48", "59", "60", "61", "62", "72", "73"], {
    message: "Province code does not map to a province"
  })
  private provinceCode: string = "";

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
    this.provinceCode = artworkData.provinceCode;
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
  public getProvinceCode(): string { return this.provinceCode; }
  // Map province code to province
  public getProvince(): string {
    switch (this.provinceCode) {
      case "10": return "Newfoundland and Labrador";
      case "11": return "Prince Edward Island";
      case "12": return "Nova Scotia";
      case "13": return "New Brunswick";
      case "24": return "Quebec";
      case "35": return "Ontario";
      case "46": return "Manitoba";
      case "47": return "Saskatchewan";
      case "48": return "Alberta";
      case "59": return "British Columbia";
      case "60": return "Yukon";
      case "61": return "Northwest Territories";
      case "62": return "Nunavut";
    }
    return "Province undefined";
  }
  public getPrice() { return this.price; }
  public getDimensions() { return [this.width, this.height, this.depth]; }
}
