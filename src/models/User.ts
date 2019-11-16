import { IsLength, IsEmail, IsAlpha, Matches, IsNumeric, IsIn } from "validator.ts/decorator/Validation";

/* User object to validate user input */
export class User {
  @IsAlpha({
    message: "Name must be alphabetical"
  })
  @IsLength(2, 32, {
    message: "Name must be between 2 and 32 characters"
  })
  private name: string = "";

  /* Generic username regexp from https://stackoverflow.com/a/12019115 */
  @Matches(RegExp("^(?=.{2,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"))
  private username: string = "";

  @IsEmail()
  private email: string = "";

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

  @IsLength(2, 32, {
    message: "Password must be between 2 and 32 characters"
  })
  private password: string = "";

  public create(userData: any) {
    this.name = userData.name;
    this.username = userData.username;
    this.email = userData.email;
    this.city = userData.city;
    this.provinceCode = userData.provinceCode;
    this.password = userData.password;
  }

  public getName(): string { return this.name; }
  public getUsername(): string { return this.username; }
  public getEmail(): string { return this.email; }
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
  public clearPassword() { this.password = ""; }
}
