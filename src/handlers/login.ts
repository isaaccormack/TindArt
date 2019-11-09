import bcrypt = require("bcrypt");
import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";

import DbClient = require("../DbClient");
import { User } from "../models/User";

/**
 * Log User In
 */

async function findUserByEmail(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    DbClient.connect()
      .then((db: any) => {
        return db.collection("users").find({ email }).toArray();
      })
      .then((result: any) => {
        if (result.length != 1) {
          resolve(); // Couldn't find users email
        }
        resolve(result[0]);
      })
      .catch((err: any) => {
        err.message = "Database find error";
        reject(err);
      });
  });
}

async function compareHashedPasswords(plaintextPassword: string, hashedPassword: string): Promise<Boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plaintextPassword, hashedPassword)
      .then((valid: Boolean) => {
        resolve(valid);
      })
      .catch((err: any) => {
        err.message = "Bcrypt compare error";
        reject(err);
      })
  });
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  // Validate user email and password manually
  const validator: Validator = new Validator();
  const validEmail: Boolean = validator.isEmail(req.body.email, {});
  const validPassword: Boolean = validator.isLength(req.body.password, 0, 32);

  if (!validEmail) {
    req.flash("emailError", "Email is invalid");
    return res.redirect("/login");
  } else if (!validPassword) {
    req.flash("passwordError", "Password is too long");
    return res.redirect("/login");
  }

  try {
    const result: any = await findUserByEmail(req.body.email);
    if (!result) {
      req.flash("loginError", "The email you entered does not belong to any account");
      return res.redirect("/login");
    }
    const valid: Boolean = await compareHashedPasswords(req.body.password, result.password);
    if (!valid) {
      req.flash("loginError", "The password you entered is incorrect");
      return res.redirect("/login");
    }
    // Create new user and set the sessions variable with it
    const user: User = new User();
    user.create(result);
    user.clearPassword(); // Clear hashed password
    user.setID(result._id);
    req.session!.user = user; // Set session variable
  } catch (err) {
    console.error(err);
    req.flash("serverError", "We couldn't log you in right now");
    return res.status(500).render('error');
  }
  return res.redirect("/");
}
