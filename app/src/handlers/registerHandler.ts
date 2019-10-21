import { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
var bcrypt = require('bcrypt');
const saltRounds = 10;
import { Validator } from "validator.ts/Validator";
const DbClient = require('../DbClient');
import { User } from '../models/User';

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
    })
}

/**
* Create New User
*/
export function createUser(req: Request, res: Response, next: NextFunction) {
  var user = new User(req.body); // change this to a DTO... because it really is just a DTO between client and db.. maybe not.....
  var validator = new Validator();
  var errors = validator.validate(user); // returns array of errors

  if (errors.length > 0) {
    console.log("User Validation Error:");
    errors.forEach((error) => console.log(error));
    // should implment proper error handling for this s.t. errors are logged and user is redirected / informed in a coherent manner
    // pretty much every error case should just redirect to handling that error in a seperate module 
    // send back register page with popup (for now) with validation error message
    res.json(errors); // should probably redirect to error page instead
  } else {
    // Async bcrypt.hash takes add user to database function as callback
    bcrypt.hash(req.body.password, saltRounds, function (err: any, hash: any) {
      if (err) {
        console.log("Bcrypt Password Hash Error:");
        console.log(err);
        // send error page with internal server error
        res.sendStatus(400); // should probably redirect to error page instead
      } else {
        DbClient.connect()
          .then((db: any) => {
            return db!.collection("users").insertOne({
              "name": user.getName(),
              "email": user.getEmail(),
              "password": hash,
            });
          })
          .then((users: any) => { // handle database response
            console.log(users);
            // maybe add user id to user object here
            // user.setID(user.fsafd.id)
            req.session!.user = user; // set session variable
            res.redirect('/');
          })
          .catch((err: any) => {
            console.error(err);
            // send error page with database error
            res.sendStatus(400); // should probably redirect to error page instead
          })
      }
    });
  }
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