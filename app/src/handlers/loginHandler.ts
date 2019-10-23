import { Request, Response, NextFunction } from 'express';
var bcrypt = require('bcrypt');
import { Db } from 'mongodb';

const DbClient = require('../DbClient');


/**
* Get User
*/
export function loginUser(req: Request, res: Response, next: NextFunction) {
  // Get User for database with hashed password
  DbClient.connect()
    .then((db: Db) => {
      return db!.collection('users').find({ email: req.body.email }).toArray();
    })
    .then((result: any) => { // handle database response
      bcrypt.compare(req.body.password, result[0].password, function(err: any, valid: boolean) {
        if(err)
          console.error(err);
        if(valid) {
         // Passwords match
         result[0].password = ""; // Clear password so it is not floating around
         req.session!.user = result[0]; // set session variable
        } else {
         // Passwords don't match
         req.flash('error', 'Email and password combination could not be found');
        }
        return res.redirect('/');
      });
    })
    .catch((err: any) => {
      console.error(err);
      req.flash('error', 'Error processing your request');
      return res.redirect('/');
    });
}