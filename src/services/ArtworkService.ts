import { DBService } from "./DBService";
import { IArtworkService, IArtworkResult, IArtworkDataJSON } from "./IArtworkService";
import { Artwork } from "../models/Artwork";
import { ObjectId } from "mongodb";

export class ArtworkService extends DBService implements IArtworkService {
  /**
   * Insert new Artwork into database
   * @param artwork the Artwork object to add to the artworks database
   * @return a Promise for the ArtworkDataJSON object of the new artwork.
   */
  public async insertNewArtwork(artwork: Artwork, photoIds: string[], userid: string): Promise<IArtworkResult> {
    try {
      const result: any = await this.db.collection("artworks").insertOne({
        "userId": userid,
        "title": artwork.getTitle(),
        "description": artwork.getDescription(),
        "city": artwork.getCity(),
        "province": artwork.getProvince(),
        "price": artwork.getPrice(),
        "dimensions": artwork.getDimensions(),
        "photos": photoIds
      });
      // Artwork couldn't be created, but insertOne() did not throw
      if (!result || result.ops.length !== 1) {
        return { err: { type: "DBError", message: "Database insert error" } };
      }
      return { result: result.ops[0] as IArtworkDataJSON };
    } catch (err) {
      return { err: { type: "DBError", message: "Database error" } };
    }
  }

  public async removeArtworkById(artworkId: string): Promise<boolean> {
    const result: any = await this.db.collection("artworks").deleteOne({ "_id": { $regex: ".*" + artworkId + ".*" } });
    if (!result || result.deletedCount !== 1) {
      return false;
    }
    return true;
  }

  /**
   * @return a Promise for a ArtworkDataJSON array containing all artwork data
   */
  public async getAllArtwork(): Promise<IArtworkDataJSON[]> {
    try {
      return await this.db.collection("artworks").find().toArray();
    } catch (err) {
      err.message = "Database artwork error";
      console.error("Failed to get all artworks: " + err);
      throw err;
    }
  }

  /**
   * Get a page of artwork
   * @param pageSize the number of artwork being requested
   * @param lastId the id of the last request
   * @return a Promise for an array of PhotoDataJSON objects and the lastId
   */
  // tslint:disable-next-line: max-line-length
  public async getArtworkPage(pageSize: number, lastId: string, city: string, province: string): Promise<[IArtworkDataJSON[], string]> {
    try {
      let result = null;
      if (lastId.length === 0) {
        result = await this.db.collection("artworks")
          .find({
              "city": { $regex: ".*" + city + ".*" }, 
              "province": { $regex: ".*" + province + ".*" } })
          .limit(pageSize).toArray();
      } else {
        result = await this.db.collection("photos").find({
          "_id": {"$gt": new ObjectId(lastId)},
          "city": { $regex: ".*" + city + ".*" }, 
          "province": { $regex: ".*" + province + ".*" }
        }).limit(pageSize).toArray();
      }

      if (!result || result.length === 0) {
        // No more photos left to paginate
        return [[], ""];
      }

      // _id is sorted by default so last id will be the greatest
      return [result as IArtworkDataJSON[], result[result.length - 1]._id];
    } catch (err) {
      err.message = "Database artwork find error";
      throw err;
    }
  }

  /**
   * Get all users artworks from their ID
   * @param userId the Artwork object to add to the artworks database
   * @return a Promise for an array of ArtworkDataJSON objects
   */
  public async findArtworkByUserID(userId: string): Promise<IArtworkDataJSON[]> {
    try {
      // For some reason this query doesn't match the user ID exactly, so check if user Id contains user Id
      const result: any = await this.db.collection("artworks").find(
        { "userId": { $regex: ".*" + userId + ".*" } })
        .toArray();
      if (!result) {
        return [];
      }

      return result as IArtworkDataJSON[];
    } catch (err) {
      err.message = "Database find error";
      throw err;
    }
  }

  /**
   * Get all users artworks from their ID
   * @param userId the Artwork object to add to the artworks database
   * @return a Promise for an array of ArtworkDataJSON objects
   */
  public async findArtworkByLocation(city: string, province: string): Promise<IArtworkDataJSON[]> {
    try {
      // For some reason this query doesn't match the user ID exactly, so check if user Id contains user Id
      const result: any = await this.db.collection("artworks").find(
        { "city": { $regex: ".*" + city + ".*" }, "province": { $regex: ".*" + province + ".*" } })
        .toArray();
      if (!result) {
        return [];
      }

      return result as IArtworkDataJSON[];
    } catch (err) {
      err.message = "Database find error";
      throw err;
    }
  }

  /**
   * Clears artwork collection
   */
  public async clearArtwork() {
    return await this.db.collection("artworks").drop();
  }
}
