import { PhotoDataJSON, PhotoDTO } from "../DTOs/PhotoDTO";
import { DBService } from "./DBService";

export class PhotoService extends DBService {
  /**
   * Insert new Photo into database
   * @param photo the Photo object to add to the photos database
   * @return a Promise for the PhotoDataJSON object of the new photo.
   */
  public static async insertNewPhoto(userId: string): Promise<PhotoDataJSON> {
    try {
      const result: any = await PhotoService.db.collection("photos").insertOne({
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

  public static async removePhotoById(photoId: string) {
    const result: any = await PhotoService.db.collection("photos").deleteOne({ "_id": photoId });
    // Photo couldn't be created, but insertOne() did not throw
    if (!result || result.deletedCount !== 1) {
      throw new Error("Database delete error");
    }
    console.log("Deleted: " + photoId);
  }

  /**
   * @return a Promise for a PhotoDataJSON array containing all photo data
   */
  public static async getAllPhotos(): Promise<PhotoDTO[]> {
    try {
      const photos = await PhotoService.db.collection("photos").find().toArray();
      return photos.map((photo: any) => {
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
  public static async findUserPhotosByID(userId: string): Promise<PhotoDataJSON[]> {
    try {
      // For some reason this query doesn't match the user ID exactly, so check if user Id contains user Id
      const result: any = await PhotoService.db.collection("photos").find(
        { "user": { $regex: ".*" + userId + ".*" } })
        .toArray();
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
  public static async clearPhotos() {
    return await PhotoService.db.collection("photos").drop();
  }
}
