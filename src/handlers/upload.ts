import { Request, Response, NextFunction } from "express";
import { Storage } from "@google-cloud/storage";
import multer from "multer";
import { insertNewPhoto, removePhotoById } from "../services/photo";
import { PhotoDataJSON, PhotoDTO } from "../DTOs/PhotoDTO";

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
}).fields([{ name: "avatar", maxCount: 1 }, { name: "gallery", maxCount: 8 }]);

const GCP_PROJECT_ID = "seng350f19-project-team-3-1";
const BUCKET_NAME = "majabris";
const CLOUD_CREDENTIAL_FILE = "./src/seng350f19-project-team-3-1-5df5aeb4df61.json";

// Creates reference to storage and bucket
const storage = new Storage({
  projectId: GCP_PROJECT_ID,
  keyFilename: CLOUD_CREDENTIAL_FILE
});
const bucket = storage.bucket(BUCKET_NAME);

/**
 * Add New Photo
 */
export function uploadPhoto(req: Request, res: Response, next: NextFunction) {
  uploader(req, res, (err: any) => {
    if (err) {
      console.error("Upload failed: " + err);
      req.flash("error", "Photo upload failed!");
    }
    return next(err);
  });
}

async function upload(exFile: Express.Multer.File, userId: string) {
  return new Promise<PhotoDTO>(async (res) => {
    const result: PhotoDataJSON = await insertNewPhoto(userId);

    const photoDTO: PhotoDTO = new PhotoDTO(result);
    const file = bucket.file(photoDTO._id);
    const stream = file.createWriteStream({
      metadata: {
        contentType: exFile.mimetype,
        cacheControl: "public, max-age=31536000"
      },
      resumable: false
    });

    stream.on("error", async (errr) => {
      try {
        await removePhotoById(photoDTO._id);
      } catch (err) {
        console.log("Error Deleting: " + photoDTO._id);
      }
      res();
    });

    stream.on("finish", () => {
      console.log(`${photoDTO._id} uploaded to ${BUCKET_NAME}.`);
      res(photoDTO);
    });

    stream.end(exFile.buffer);
  });
}

export async function uploadToGCP(req: Request, res: Response, next: NextFunction) {
  if ("avatar" in req.files) {
    await upload(req.files.avatar[0], req.session!.user._id);
  } else if ("gallery" in req.files) {
    const all = req.files.gallery.map((file) => upload(file, req.session!.user._id));
    const combine = Promise.all(all);
    await combine;
  }
  next();
}
