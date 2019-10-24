import { Request, Response, NextFunction } from 'express';
import { Db } from 'mongodb';

const DbClient = require('../DbClient');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, 'uploads')
  },
  filename: function (req: any, file: any, cb: any) {
    getNextPhotoID(req).then((filename: string) => {
      cb(null, filename + '.' + file.originalname.split('.').pop());
    });
  }
});

const uploader = multer({ storage: storage }).fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]);

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
  uploader(req, res, (err: any) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Photo upload failed!');
    }
    next();
  });
}

function getNextPhotoID(req: Request) {
  return DbClient.connect()
  .then((db: Db) => {
    return db!.collection("photos").insertOne({
      "user": req.session!.user._id
    });
  })
  .then((result: any) => { // handle database response
    if (result) {
      console.log('Upload: ' + result.insertedId);
      return result.insertedId.toString();
    }
  });
}