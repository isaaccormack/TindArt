import { IsLength, IsEmail, IsAlpha } from "validator.ts/decorator/Validation";

export class User {

  @IsAlpha({
    message: "Name must be alphabetical"
  })
  @IsLength(2, 32, {
    message: "Name must be between 2 and 32 characters"
  })
  public name: string = '';

  @IsEmail()
  public email: string = '';

  @IsLength(2, 32, {
    message: "Password must be between 2 and 32 characters"
  })
  public password: string = '';

  public getName() { return this.name; }
  public getEmail() { return this.email; }

}
