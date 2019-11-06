import { Request, Response, NextFunction } from "express";
import { Db } from "mongodb";
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";
import { User } from "../models/User";
import bcrypt = require("bcrypt");

import DbClient = require("../DbClient");

/* Util Function for Handling Validation Errors */
function loginValidationErrorRes(req: Request, res: Response, errors: ValidationErrorInterface[]) {
  // Extract errors into their own object for ease of client side rendering
  errors.forEach((error: ValidationErrorInterface) => {
    if (error.property == 'email') {
      req.flash("emailError", "Email is invalid"); // Not able to add err msg in IsEmail() in user model
    }
  });
  return res.redirect("/login");
}

/* Util Function for Handling Generic Server Errors */
function loginServerErrorRes(req: Request, res: Response, logMsg: string, err: any) {
  console.error(logMsg);
  console.error(err);
  req.flash("serverError", "We couldn't log you in right now");
  return res.status(500).render('error');
}

/**
 * Log User In
 */
export function loginUser(req: Request, res: Response, next: NextFunction) {
  // Create User object to validate user input
  const user: User = new User();
  user.email = req.body.email;
  const validator: Validator = new Validator();
  const errors: ValidationErrorInterface[] = validator.validate(user, { skipMissingProperties: true });

  // Send back any validation errors
  if (errors.length > 0) return loginValidationErrorRes(req, res, errors);

  // Query database for an account with matching email
  DbClient.connect()
    .then((db: any) => {
      return db.collection("users").find({ email: user.email }).toArray();
    })
    .then((result: any) => {
      if (result.length != 1) {
        req.flash("loginError", "The email you entered does not belong to any account");
        return res.redirect("/login");
      }
      bcrypt.compare(req.body.password, result[0].password, (err: Error, valid: boolean) => {
        if (err) return loginServerErrorRes(req, res, "Bcrypt error", err);

        if (valid) { // Passwords match
          const userData = result[0];
          userData.password = ""; // Clear password so it is not floating around
          req.session!.user = userData; // Set session variable
          return res.redirect("/");
        }
        // Passwords don't match
        req.flash("loginError", "The password you entered is incorrect");
        return res.redirect("/login");
      });
    })
    .catch((err: any) => {
      return loginServerErrorRes(req, res, "Database find error", err);
    });
}
