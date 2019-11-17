import { Photo } from "../models/Photo";
import { ObjectId } from "mongodb";
import { PhotoDataJSON, PhotoDTO } from "../DTOs/PhotoDTO";
import { getDb } from "../database/dbclient";
import { type } from "os";

/**
 * Insert new Photo into database
 * @param photo the Photo object to add to the photos database
 * @return a Promise for the PhotoDataJSON object of the new photo.
 */
export async function insertNewPhoto(userId: string): Promise<PhotoDataJSON> {
  try {
    const result: any = await getDb().collection("photos").insertOne({
      "user": userId
    });
    // Photo couldn't be created, but insertOne() did not throw
    if (!result || result.ops.length !== 1) {
      throw new Error("Database insert error");
    }
    console.log("Upload: " + result.insertedId);
    return result.ops[0] as PhotoDataJSON;
  } catch (err) {
    err.message = "Database error";
    throw err;
  }
}

export async function removePhotoById(photoId: string) {
  const result: any = await getDb().collection("photos").deleteOne({ "_id": photoId });
  // Photo couldn't be created, but insertOne() did not throw
  if (!result || result.deletedCount !== 1) {
    throw new Error("Database delete error");
  }
  console.log("Deleted: " + photoId);
}

/**
 * @return a Promise for a PhotoDataJSON array containing all photo data
 */
export async function getAllPhotos(): Promise<PhotoDTO[]> {
  try {
    const photos = await getDb().collection("photos").find().toArray();
    return photos.map((photo) => {
      return new PhotoDTO(photo);
    });
  } catch (err) {
    err.message = "Database photo error";
    console.error("Failed to get all photos: " + err);
    throw err;
  }
}

/**
 * Get all users photos from their ID
 * @param userId the Photo object to add to the photos database
 * @return a Promise for an array of PhotoDataJSON objects
 */
export async function findUserPhotosByID(userId: string): Promise<PhotoDataJSON[]> {
  try {
    // For some reason this query doesn't match the user ID exactly, so check if user Id contains user Id
    const result: any = await getDb().collection("photos").find({ "user": { $regex: ".*" + userId + ".*" } }).toArray();
    if (!result) {
      throw new Error("Database find error");
    }

    return result as PhotoDataJSON[];
  } catch (err) {
    err.message = "Database find error";
    throw err;
  }
}

/**
 * Clears photo collection
 */
export async function clearPhotos() {
  return await getDb().collection("photos").drop();
}
