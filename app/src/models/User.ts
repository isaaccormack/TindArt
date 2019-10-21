// var crypto = require('crypto');
// import { Request } from 'express';
import { IsLength, IsEmail, IsAlpha, IsAlphanumeric } from "validator.ts/decorator/Validation";

export class User {

  @IsAlpha()
  @IsLength(2, 20)
  name: string;

  @IsEmail()
  @IsLength(2, 20)
  email: string;

  @IsAlphanumeric()
  @IsLength(3, 20)
  password: string;

  constructor({ name, email, password }: { name: string, email: string, password: string }) {
    this.name = name;
    this.email = email;
    this.password = password; // create password only to validate
  }

  public getName() { return this.name; }
  public getEmail() { return this.email; }

}

// export class User {
//   constructor(public name: string, public email: string, public password: string) { }
// }
