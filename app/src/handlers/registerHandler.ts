import { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
var bcrypt = require('bcrypt');
const saltRounds = 10;
import { Validator } from "validator.ts/Validator";
const DbClient = require('../DbClient');
import { User } from '../models/User';
import { ValidationErrorInterface } from 'validator.ts/ValidationErrorInterface';
import { Hash } from 'crypto';
import { Db } from 'mongodb';

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
// need to add uniqueness constraints with email
export function createUser(req: Request, res: Response, next: NextFunction) {
  // Create User object to validate user input
  var user: User = new User(req.body);
  var validator: Validator = new Validator();
  var errors: ValidationErrorInterface[] = validator.validate(user);

  // Send back validation errors, if any
  if (errors.length > 0) {
    errors.forEach((error: ValidationErrorInterface) => { req.flash('error', error.errorMessage) });
    return res.redirect('/register');
  }

  // Async bcrypt.hash takes add user to database function as callback
  bcrypt.hash(req.body.password, saltRounds, function (err: Error, hash: Hash) {
    if (err) {
      console.log('Bcrypt Password Hash Error'); // Only log internal errors to server
      console.log(err);

      req.flash('error', 'Couldn\'t process user request')
      return res.redirect('/register');
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
      .then(() => { // handle database response
        req.session!.user = user; // set session variable
        return res.redirect('/');
      })
      .catch((err: NodeJS.ErrnoException) => {
        console.error('Database Insert Error');
        console.error(err);
        if (err.code && parseInt(err.code) == 11000) {
          req.flash('error', 'An account with this email already exists, maybe you would like to reset your password?');
        } else {
          req.flash('error', 'Database Error');
        }
        return res.redirect('/register');
      })
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