import { IsLength, IsEmail, IsAlpha, IsAlphanumeric, Matches } from "validator.ts/decorator/Validation";

export class User {

  @IsAlpha({
    message: "Name must be alphabetical"
  })
  @IsLength(2, 32, {
    message: "Name must be between 2 and 32 characters"
  })
  public name: string = '';

  /* Generic username regexp from https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username */
  @Matches(RegExp("^(?=.{2,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"))
  public username: string = '';

  @IsEmail()
  public email: string = '';

  @IsLength(2, 32, {
    message: "Password must be between 2 and 32 characters"
  })
  public password: string = '';

  public getName() { return this.name; }
  public getUsername() { return this.username; }
  public getEmail() { return this.email; }

}
