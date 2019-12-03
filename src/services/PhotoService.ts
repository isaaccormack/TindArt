import { DBService } from "./DBService";
import { IPhotoService, IPhotoResult, IPhotoDataJSON } from "./IPhotoService";

export class PhotoService extends DBService implements IPhotoService {
  /**
   * Insert new Photo into database
   * @param photo the Photo object to add to the photos database
   * @return a Promise for the PhotoDataJSON object of the new photo.
   */
  public async insertNewPhoto(userId: string): Promise<IPhotoResult> {
    try {
      const result: any = await this.db.collection("photos").insertOne({
        "user": userId
      });
      // Photo couldn't be created, but insertOne() did not throw
      if (!result || result.ops.length !== 1) {
        return { err: { type: "DBError", message: "Database insert error" } };
      }
      console.log("Upload: " + result.insertedId);
      return { result: result.ops[0] as IPhotoDataJSON };
    } catch (err) {
      return { err: { type: "DBError", message: "Database error" } };
    }
  }

  public async removePhotoById(photoId: string): Promise<boolean> {
    const result: any = await this.db.collection("photos").deleteOne({ "_id": photoId });
    // Photo couldn't be created, but insertOne() did not throw
    if (!result || result.deletedCount !== 1) {
      return false;
    }
    return true;
  }

  /**
   * @return a Promise for a PhotoDataJSON array containing all photo data
   */
  public async getAllPhotos(): Promise<IPhotoDataJSON[]> {
    try {
      return await this.db.collection("photos").find().toArray();
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
  public async findUserPhotosByID(userId: string): Promise<IPhotoDataJSON[]> {
    try {
      // For some reason this query doesn't match the user ID exactly, so check if user Id contains user Id
      const result: any = await this.db.collection("photos").find(
        { "user": { $regex: ".*" + userId + ".*" } })
        .toArray();
      if (!result) {
        return [];
      }

      return result as IPhotoDataJSON[];
    } catch (err) {
      err.message = "Database find error";
      throw err;
    }
  }

  /**
   * Clears photo collection
   */
  public async clearPhotos() {
    return await this.db.collection("photos").drop();
  }
}
