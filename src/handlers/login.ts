import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";

import { UserDataJSON, UserDTO } from "../DTOs/UserDTO";
import { findOneUserByAttr } from "../services/user";

/**
 * Compare Hashed Passwords Util
 */
async function compareHashedPasswords(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
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
export async function loginUser(req: Request, res: Response, next: NextFunction) {
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
    const result: UserDataJSON | null = await findOneUserByAttr("email", req.body.email);
    if (!result) {
      req.flash("loginError", "The email you entered does not belong to any account");
      return res.redirect("/login");
    }
    const valid: boolean = await compareHashedPasswords(req.body.password, result.password);
    if (!valid) {
      req.flash("loginError", "The password you entered is incorrect");
      return res.redirect("/login");
    }

    // Create new user DTO and set the session variable with it
    const userDTO: UserDTO = new UserDTO(result);
    req.session!.user = userDTO; // Set session variable

  } catch (err) {
    console.error(err);
    req.flash("serverError", "We couldn't log you in right now");
    return res.status(500).render("error");
  }

  return res.redirect("/");
}
