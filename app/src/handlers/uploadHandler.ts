import { Request, Response, NextFunction } from 'express';
import { Db } from 'mongodb';

const DbClient = require('../DbClient');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
      cb(null, 'uploads')
    },
    filename: function (req:any, file:any, cb:any) {
      cb(null, file.originalname)
    }
  });

const uploader = multer({ storage: storage });

/**
* Get All Photos
*/
export function getAllPhotos(req: Request, res: Response, next: NextFunction) {
  DbClient.connect()
    .then((db: any) => {
      return db!.collection("photos").find().toArray();
    })
    .then((photos: any) => {
      console.log(photos);
      res.send(photos);
    })
    .catch((err: any) => {
      console.error(err);
    })
}

/**
* Add New Photo
*/
export function uploadPhoto(req: Request, res: Response, next: NextFunction) {

  console.log(req.file);
    // Add User to database with hashed password
    DbClient.connect()
      .then((db: Db) => {
        return db!.collection("photos").insertOne({
          "user": 1//req.session!.user._id
        });
      })
      .then((result: any) => { // handle database response
        if(result) {
            console.log('Upload: ' + result.insertedId);
            let resultUploader = uploader.single('imageupload');

            resultUploader(req, res, function(err: any) {
                if (err) {
                    console.error(err);
                    req.flash('error', 'Photo upload failed!');
                } else {
                    console.log("success: " + result.insertedId);
                    req.flash('result', 'Successfully uploaded photo');
                }
                return res.redirect('/upload');
            });
        }
      })
      .catch((err: NodeJS.ErrnoException) => {
        console.error('Database Insert Error');
        console.error(err);
        req.flash('error', 'Database Error');
        return res.redirect('/upload');
      });
}