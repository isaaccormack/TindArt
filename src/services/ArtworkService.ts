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
        "units": artwork.getUnits(),
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
   * Get all users artworks from their ID
   * @param userId the Artwork object to add to the artworks database
   * @return a Promise for an array of ArtworkDataJSON objects
   */
  public async findArtworkByUserID(userId: string): Promise<IArtworkDataJSON[]> {
    try {
      // For some reason this query doesn't match the user ID exactly, so check if user Id contains user Id
      const result: any = await this.db.collection("artworks").find({
        "userId": { $regex: ".*" + userId + ".*" }
      }).toArray();

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
   * @return Relevant artwork objects from the database.
   */
  public async findArtworkByLocation(city: string, province: string, excludeIds: string[]): Promise<IArtworkDataJSON[]> {
    try {
      const excludeObjs: ObjectId[] = excludeIds.map((id) => new ObjectId(id));
      const result: any = await this.db.collection("artworks").find({
        "city": city,
        "province": province,
        "_id": { $nin: excludeObjs },
      }).toArray();

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
   * Get artworks by their ID
   * @param artworkIds the artwork IDs to search for
   * @return a Promise for an array of ArtworkDataJSON objects
   */
  public async findArtworkByArtworkID(artworkIds: string[]): Promise<IArtworkDataJSON[]> {
    const artworkObjs: ObjectId[] = artworkIds.map((id) => new ObjectId(id));
    try {
      const result: any = await this.db.collection("artworks").find({
        "_id": { $in: artworkObjs }
      }).toArray();

      if (!result) {
        return [];
      }
      return result as IArtworkDataJSON[];
    } catch (err) {
      err.message = "Database error";
      throw err;
    }
  }
}
