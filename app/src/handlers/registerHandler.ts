import { Request, Response, NextFunction } from "express";
import { Db } from "mongodb";
import { Hash } from "crypto";
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";
import { User } from "../models/User";
const bcrypt = require("bcrypt");

const saltRounds = 10;
const DbClient = require("../database/DbClient");

/**
 * Get All Users
 */
export function getAllUsers(req: Request, res: Response, next: NextFunction) {
  DbClient.connect()
    .then((db: any) => {
      return db!.collection("users").find().toArray();
    })
    .then((users: any) => {
      console.log(users);
      res.send(users);
    })
    .catch((err: any) => {
      console.error(err);
    });
}

/**
 * Create New User
 */
// need to add uniqueness constraints with email
export function createUser(req: Request, res: Response, next: NextFunction) {
  // Create User object to validate user input
  const user: User = new User(req.body);
  const validator: Validator = new Validator();
  const errors: ValidationErrorInterface[] = validator.validate(user);

  // Send back validation errors, if any
  if (errors.length > 0) {
    errors.forEach((error: ValidationErrorInterface) => { req.flash("error", error.errorMessage); });
    return res.redirect("/register");
  }

  // Async bcrypt.hash takes add user to database function as callback
  bcrypt.hash(req.body.password, saltRounds, (err: Error, hash: Hash) => {
    if (err) {
      console.log("Bcrypt Password Hash Error"); // Only log internal errors to server
      console.log(err);

      req.flash("error", "Couldn't process user request");
      return res.redirect("/register");
    }

    // Add User to database with hashed password
    DbClient.connect()
      .then((db: Db) => {
        return db!.collection("users").insertOne({
          "name": user.getName(),
          "email": user.getEmail(),
          "password": hash,
        });
      })
      .then((result: any) => { // handle database response
        if (result.ops.length > 0) {
          let newUser = result.ops[0];
          newUser.password = ""; // Clear password so it is not floating around
          req.session!.user = newUser; // set session variable
          console.log(req.session!.user._id);
          return res.redirect('/');
        } else {
          req.flash('error', 'Error registering');
          return res.redirect('/register');
        }
      })
      .catch((err: NodeJS.ErrnoException) => {
        console.error("Database Insert Error");
        console.error(err);
        if (err.code && parseInt(err.code, 10) === 11000) {
          req.flash("error", "An account with this email already exists, maybe you would like to reset your password?");
        } else {
          req.flash("error", "Database Error");
        }
        return res.redirect("/register");
      });
  });
}

  //   /**
  //    * GET one hero by id
  //    */
  //   public getOne(req: Request, res: Response, next: NextFunction) {
  //     let query = parseInt(req.params.id);
  //     DbClient.connect()
  //       .then((db: any) => {
  //         return db!.collection("heroes").find({ id: query }).toArray();
  //       })
  //       .then((heroes: any) => {
  //         console.log(heroes);
  //         res.send(heroes);
  //       })
  //       .catch((err: any) => {
  //         console.error(err);
  //       })
  //   }
