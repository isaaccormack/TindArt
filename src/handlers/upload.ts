import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { IPhotoResult, IPhotoService } from "../services/IPhotoService";
const aws = require('aws-sdk');

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
}).fields([{ name: "avatar", maxCount: 1 }, { name: "gallery", maxCount: 8 }]);

export class UploadHandler {
  private photoService: IPhotoService;

  constructor(photoService: IPhotoService) {
    this.photoService = photoService;
  }

  /**
   * Add New Photo
   */
  public uploadPhoto(req: Request, res: Response, next: NextFunction) {
    uploader(req, res, async (err: any) => {
      if (err) { // unify this error handling
        console.error("Upload photo failed: " + err);
        req.flash("error", "Photo upload failed!");
        return next(err);
      }

      if ("gallery" in req.files) { // fix the need for this if condition
        const all = req.files.gallery.map((file) => this.uploadArtworkPhoto(file, req.session!.user._id));
        const combine = Promise.all(all);
        await combine;
      }
      next();
    });
  }

  /**
   * Add New Avatar
   */
  public uploadAvatar(req: Request, res: Response, next: NextFunction) {
    uploader(req, res, async (err: any) => {
      if (err) {
        console.error("Upload avatar failed: " + err);
        req.flash("error", "Photo upload failed!");
        return next(err);
      }
      if ("avatar" in req.files) {
        await this.uploadToGCP(req.files.avatar[0], req.session!.user.username);
      }

      next();
    });
  }

  private async uploadArtworkPhoto(exFile: Express.Multer.File, userId: string): Promise<IPhotoResult> {
    const result: IPhotoResult = await this.photoService.insertNewPhoto(userId);
    if (result.err) {
      exFile.filename = "-1";
      return result;
    }
    await this.uploadToGCP(exFile, result.result!._id.toString());
    exFile.filename = result.result!._id.toString();
    return result;
  }

  private async uploadToGCP(exFile: Express.Multer.File, photoId: string) {
    return new Promise<void>(async (res) => {
      var params = {
        ACL: 'public-read',
        Bucket: process.env.BUCKET_NAME,
        Body: exFile.buffer,
        Key: photoId
      };
  
      try {
        await s3.upload(params).promise();
      } catch(err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
        try {
          await this.photoService.removePhotoById(photoId);
        } catch (err) {
          console.log("Error removing photo " + photoId + " from database");
        }
        res();
      }
      console.log(`${photoId} uploaded to bucket!`);
      res();
    });
  }
}