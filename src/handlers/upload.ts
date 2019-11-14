import { Request, Response, NextFunction } from 'express';
import { Db } from 'mongodb';
import multer from 'multer';

import { getDb } from '../database/dbclient';

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
export async function getAllPhotos(req: Request, res: Response, next: NextFunction) {
  const db: Db = getDb();
  try {
    const photos = await db.collection("photos").find().toArray();
    console.log(photos);
    res.send(photos);
  } catch (err) {
    console.error("Failed to get all photos: " + err);
    throw err;
  }
}

/**
* Add New Photo
*/
export function uploadPhoto(req: Request, res: Response, next: NextFunction) {
  uploader(req, res, (err: any) => {
    if (err) {
      console.error("Upload failed: " + err);
      req.flash('error', 'Photo upload failed!');
    }
    next();
  });
}

async function getNextPhotoID(req: Request) {
  const db: Db = getDb();
  const result: any = await db.collection("photos").insertOne({
    "user": req.session!.user._id
  });
  if (result) {
    console.log("Upload: " + result.insertedId);
    return result.insertedId.toString();
  }
}