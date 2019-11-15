import { Photo } from "../models/Photo";
import { PhotoDataJSON, PhotoDTO } from "../DTOs/PhotoDTO";
import { getDb } from "../database/dbclient";

export interface DbPhotoResult { // Type returned by insertNewPhoto
  // Types can be undefined so result can be falsey if error present and vice versa
  err?: {
    type: string;
    message: string;
  };
  result?: PhotoDataJSON;
}

/**
 * Insert new Photo into database
 * @param photo the Photo object to add to the photos database
 * @return a Promise for a DbResult object, which contains either the PhotoDataJSON object
 * of the new photo, or an error message. An error message is returned if the photo failed
 * to upload.
 */
export async function insertNewPhoto(userId: string): Promise<DbPhotoResult> {
  try {
    const result: any = await getDb().collection("photos").insertOne({
      "user": userId
    });
    // Photo couldn't be created, but insertOne() did not throw
    if (!result || result.ops.length !== 1) {
        throw new Error("Database insert error");
    }
    console.log("Upload: " + result.insertedId);
    return { result: result.ops[0] as PhotoDataJSON };
  } catch (err) {
    err.message = "Database error";
    throw err;
  }
}

export async function removePhotoById(photoId: string) {
    const result: any = await getDb().collection("photos").deleteOne({"_id": photoId });
    // Photo couldn't be created, but insertOne() did not throw
    if (!result || result.deletedCount !== 1) {
        throw new Error("Database delete error");
    }
    console.log("Deleted: " + photoId);
}

/**
 * @return a Promise for either a PhotoDataJSON array containing all photo data
 */
export async function getAllPhotos(): Promise<PhotoDTO[] | null> {
  try {
    const photos = await getDb().collection("photos").find().toArray();
    return photos.map((photo) => {
      const photoDTO = new PhotoDTO();
      photoDTO.create(photo);
      return photoDTO;
    });
  } catch (err) {
    err.message = "Database photo error";
    console.error("Failed to get all photos: " + err);
    throw err;
  }
}

/**
 * Clears photo collection
 */
export async function clearPhotos() {
  return await getDb().collection("photos").drop();
}
