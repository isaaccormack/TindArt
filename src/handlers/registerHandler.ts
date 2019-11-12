import { Request, Response, NextFunction } from "express";
import { Db } from "mongodb";
import { Hash } from "crypto";
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";
import { User } from "../models/User";
import bcrypt = require("bcrypt");

import DbClient = require("../DbClient");
import e = require("express");

const saltRounds = 10;

/* Util Function for Handling Validation Errors */
function registerValidationErrorRes(req: Request, res: Response, errors: ValidationErrorInterface[]) {
  // Extract errors into their own object for ease of client side rendering
  errors.forEach((error: ValidationErrorInterface) => {
    switch (error.property) {
      case 'name':
        req.flash("nameError", error.errorMessage);
        break;
      case 'email':
        req.flash("emailError", "Email is invalid"); // Not able to add err msg in IsEmail() in user model
        break;
      case 'password':
        req.flash("passwordError", error.errorMessage);
        break;
    }
  });
  return res.redirect("/register");
}

/* Util Function for Handling Generic Server Errors */
function registerServerErrorRes(req: Request, res: Response, logMsg: string, err: any) {
  console.error(logMsg);
  console.error(err);
  req.flash("serverError", "We couldn't make you an account right now");
  return res.status(500).render('error');
}

/**
 * Get All Users (For Development)
 */
export function getAllUsers(req: Request, res: Response, next: NextFunction) {
  DbClient.connect()
    .then((db: any) => {
      return db.collection("users").find().toArray();
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
export function createUser(req: Request, res: Response, next: NextFunction) {
  // Create User object to validate user input
  const user: User = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  const validator: Validator = new Validator();
  const errors: ValidationErrorInterface[] = validator.validate(user);

  // Send back any validation errors
  if (errors.length > 0) return registerValidationErrorRes(req, res, errors);

  // Hash password, async bcrypt.hash takes add user to database function as callback
  bcrypt.hash(req.body.password, saltRounds, (err: Error, hash: string) => {
    if (err) return registerServerErrorRes(req, res, "Bcrypt error", err);

    // Add User to database with hashed password
    DbClient.connect()
      .then((db: any) => {
        return db.collection("users").insertOne({
          "name": user.getName(),
          "email": user.getEmail(),
          "password": hash,
        });
      })
      .then((result: any) => {
        if (result.ops.length > 0) { // User created successfully
          const newUser = result.ops[0];
          newUser.password = ""; // Clear password so it is not floating around
          req.session!.user = newUser; // Set session variable
          return res.redirect("/");
        }
        return registerServerErrorRes(req, res, "Database insert error", err);
      })
      .catch((error: NodeJS.ErrnoException) => {
        if (error.code && parseInt(error.code, 10) === 11000) {
          req.flash("registerError", "An account with this email already exists");
          return res.redirect("/register");
        }
        return registerServerErrorRes(req, res, "Database insert error", err);
      });
  });
}
