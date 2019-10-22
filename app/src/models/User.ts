import { IsLength, IsEmail, IsAlpha } from "validator.ts/decorator/Validation";

export class User {

  @IsAlpha({
    message: "Name must be strictly alpha"
  })
  @IsLength(2, 32, {
    message: "Name must be between 2 and 32 characters"
  })
  name: string;

  @IsEmail()
  email: string;

  @IsLength(2, 32, {
    message: "Password must be between 2 and 32 characters"
  })
  password: string;

  constructor({ name, email, password }: { name: string, email: string, password: string }) {
    this.name = name;
    this.email = email;
    this.password = password; // only have password for validation
  }

  public getName() { return this.name; }
  public getEmail() { return this.email; }

}