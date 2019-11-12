import axios from 'axios';
import bcrypt = require("bcrypt");
import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";

import DbClient = require("../DbClient");
import { User } from "../models/User";

/**
 * Create New User
 */

function registerValidationErrorRes(req: Request, res: Response, errors: ValidationErrorInterface[]) {
  // Extract errors into their own object for ease of client side rendering
  errors.forEach((error: ValidationErrorInterface) => {
    switch (error.property) {
      case 'name':
        req.flash("nameError", error.errorMessage);
        break;
      case 'username':
        req.flash("usernameError", "Usename is invalid - only alphanumeric . and _ characters allowed");
        break;
      case 'email':
        req.flash("emailError", "Email is invalid"); // Not able to add err msg in IsEmail() in user model
        break;
      case 'city':
        req.flash("locationError", error.errorMessage);
        break;
      case 'province':
        req.flash("locationError", error.errorMessage);
        break;
      case 'password':
        req.flash("passwordError", error.errorMessage);
        break;
    }
  });
  return res.redirect("/register");
}

async function validateLocation(city: string, provinceCode: number): Promise<Boolean> {
  const url: string =
    "http://geogratis.gc.ca/services/geoname/en/geonames.json?q=" + city + "&province=" + provinceCode + "&concise=CITY";
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((res: any) => {
        const matchingCities = res.data.items;
        // If we don't find any matching cities, or the user input city name doesn't match the name returned
        if (matchingCities.length > 0 && matchingCities[0].name.toLowerCase() == city.toLowerCase()) {
          resolve(true);
        }
        resolve(false);
      })
      .catch((err: any) => {
        err.message = "Canadian geographical database error";
        reject(err);
      });
  });
}

async function getHashedPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10) // Use 10 salt rounds
      .then((hash: string) => { resolve(hash); })
      .catch((err) => {
        err.message = "Bcrypt hash error";
        reject(err);
      });
  });
}

// The returned object type from the addUserToDB function
interface validationError {
  type: string;
  message: string;
}

async function addUserToDB(user: User, hash: string): Promise<validationError> {
  return new Promise((resolve, reject) => {
    DbClient.connect()
      .then((db: any) => {
        return db.collection("users").insertOne({
          "name": user.getName(),
          "username": user.getUsername(),
          "email": user.getEmail(),
          "city": user.getCity(),
          "provinceCode": user.getProvinceCode(),
          "password": hash,
        });
      })
      .then((result: any) => {
        if (result.ops.length != 1) { // User couldn't be created
          reject(Error("Database insert error"));
        }
        user.setID(result.ops[0]._id);
        resolve(); // Resolve with empty which is falsey
      })
      .catch((err: any) => {
        if (err.code && parseInt(err.code, 10) === 11000) { // Username is not unique
          if (err.keyPattern.username) {
            resolve({ type: "usernameError", message: "An account with this username already exists" })
          } else if (err.keyPattern.email) {
            resolve({ type: "emailError", message: "An account with this email already exists" })
          }
        } else {
          err.message = "Database error";
          reject(err);
        }
      });
  });
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  // Create User object to validate user input
  const user: User = new User();
  user.create(req.body);
  const validator: Validator = new Validator();
  const errors: ValidationErrorInterface[] = validator.validate(user);
  user.clearPassword();

  // Send back any validation errors
  if (errors.length > 0) return registerValidationErrorRes(req, res, errors);

  try {
    const valid: Boolean = await validateLocation(user.getCity(), user.getProvinceCode());
    if (!valid) {
      req.flash("locationError", "City could not be found");
      return res.redirect("/register");
    }

    const hash: string = await getHashedPassword(req.body.password);

    const err: validationError = await addUserToDB(user, hash);
    if (err) {
      req.flash(err.type, err.message);
      return res.redirect("/register");
    }
    req.session!.user = user; // Set session variable
  } catch (err) {
    console.error(err);
    req.flash("serverError", "We couldn't make you an account right now");
    return res.status(500).render('error');
  }
  return res.redirect("/");
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

