import { Request, Response, NextFunction } from "express";
import { Db } from "mongodb";
import bcrypt = require("bcrypt");

import DbClient = require("../DbClient");

/**
 * Get User
 */
export function loginUser(req: Request, res: Response, next: NextFunction) {
  // Get User for database with hashed password
  DbClient.connect()
    .then((db: any) => {
      return db.collection("users").find({ email: req.body.email }).toArray();
    })
    .then((result: any) => { // handle database response
      if (result.length != 1) {
        req.flash("error", "Email and password combination could not be found");
        return res.redirect("/login");
      }
      bcrypt.compare(req.body.password, result[0].password, (err: Error, valid: boolean) => {
        if (err) {
          console.error(err);
        }
        if (valid) {
         // Passwords match
         result[0].password = ""; // Clear password so it is not floating around
         req.session!.user = result[0]; // set session variable
        } else {
         // Passwords don't match
         req.flash("error", "Email and password combination could not be found");
        }
        return res.redirect("/login");
      });
    })
    .catch((err: any) => {
      console.error(err);
      req.flash("error", "Error processing your request");
      return res.redirect("/login");
    });
}
