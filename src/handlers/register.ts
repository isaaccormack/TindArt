import axios from "axios";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";

import { DbResult, insertNewUser } from "../services/user";
import { User } from "../models/User";
import { UserDTO } from "../DTOs/UserDTO";

// NEED TO TEST THIS WIth postman to make sure doesnt crash still

/**
 * Render Register Validation Errors Util
 */
function registerValidationErrorRes(req: Request, res: Response, errors: ValidationErrorInterface[]) {
  // Extract errors into their own object for ease of client side rendering
  errors.forEach((error: ValidationErrorInterface) => {
    switch (error.property) {
      case "name":
        req.flash("nameError", error.errorMessage);
        break;
      case "username":
        req.flash("usernameError", "Usename is invalid - only alphanumeric . and _ characters allowed");
        break;
      case "email":
        req.flash("emailError", "Email is invalid"); // Not able to add err msg in IsEmail() in user model
        break;
      case "city":
        req.flash("locationError", error.errorMessage);
        break;
      case "provinceCode":
        req.flash("locationError", error.errorMessage);
        break;
      case "password":
        req.flash("passwordError", error.errorMessage);
        break;
    }
  });

  return res.redirect("/register");
}

/**
 * Validate Location Util
 */
async function validateLocation(city: string, provinceCode: string): Promise<boolean> {
  const url: string =
    "http://geogratis.gc.ca/services/geoname/en/geonames.json" +
    "?q=" + city + "&province=" + provinceCode + "&concise=CITY";
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((res: any) => {
        const matchingCities = res.data.items;
        // If we don't find any matching cities, or the user input city name doesn't match the name returned
        if (matchingCities.length > 0 && matchingCities[0].name.toLowerCase() === city.toLowerCase()) {
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

/**
 * Async Function Wrapper Around Bcrypt Hash
 */
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

/**
 * Create New User
 */
/* Known defect - all req.body params must be present or server will crash */
export async function createUser(req: Request, res: Response, next: NextFunction) {
  // Create User object to validate user input
  const user: User = new User();
  user.create(req.body);
  const validator: Validator = new Validator();
  const errors: ValidationErrorInterface[] = validator.validate(user);
  user.clearPassword();

  // Send back any validation errors
  if (errors.length > 0) {
    return registerValidationErrorRes(req, res, errors);
  }

  try {
    const valid: boolean = await validateLocation(user.getCity(), user.getProvinceCode());
    if (!valid) {
      req.flash("locationError", "City could not be found");
      return res.redirect("/register");
    }

    const hash: string = await getHashedPassword(req.body.password);

    const { err, result }: DbResult = await insertNewUser(user, hash);
    if (err) {
      req.flash(err.type, err.message);
      return res.redirect("/register");
    }

    // Create new user DTO and set the sessions variable with it
    const userDTO: UserDTO = new UserDTO(result!); // Assert that result is not undefined
    req.session!.user = userDTO;

  } catch (err) {
    console.error(err);
    req.flash("serverError", "We couldn't make you an account right now");
    return res.status(500).render("error");
  }

  return res.redirect("/");
}
