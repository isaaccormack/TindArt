import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";

import { UserDTO } from "../DTOs/UserDTO";
import { IUserService, IUserResult } from "../services/IUserService";

export class LoginHandler {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
   }
  /**
   * Compare Hashed Passwords Util
   */
  private async compareHashedPasswords(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plaintextPassword, hashedPassword)
        .then((valid: boolean) => {
          resolve(valid);
        })
        .catch((err: any) => {
          err.message = "Bcrypt compare error";
          reject(err);
        });
    });
  }

  /**
   * Log User In
   */
  public async loginUser(req: Request, res: Response, next: NextFunction) {
    const validator: Validator = new Validator();
    const validEmail: boolean = validator.isEmail(req.body.email, {});
    const validPassword: boolean = validator.isLength(req.body.password, 0, 32);
    if (!validEmail) {
      req.flash("emailError", "Email is invalid");
      return res.redirect("/login");
    } else if (!validPassword) {
      req.flash("passwordError", "Password is too long");
      return res.redirect("/login");
    }

    try {
      const result: IUserResult = await this.userService.findOneUserByAttr("email", req.body.email);
      if (result.err && result.err.type === "NotFound") {
        req.flash("loginError", "The email you entered does not belong to any account");
        return res.redirect("/login");
      }
      const valid: boolean = await this.compareHashedPasswords(req.body.password, result.result!.password);
      if (!valid) {
        req.flash("loginError", "The password you entered is incorrect");
        return res.redirect("/login");
      }
      // Create new user DTO and set the session variable with it
      const userDTO: UserDTO = new UserDTO(result.result!);
      req.session!.user = userDTO; // Set session variable
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We couldn't log you in right now");
      return res.status(500).render("error");
    }
    return res.redirect("/");
  }
}
