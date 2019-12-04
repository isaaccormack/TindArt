import { DBService } from "./DBService";
import { IArtworkService, IArtworkResult, IArtworkDataJSON } from "./IArtworkService";
import { Artwork } from "../models/Artwork";

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
   * Get artworks by their ID
   * @param artworkIds the artwork IDs to search for
   * @return a Promise for an array of ArtworkDataJSON objects
   */
  public async findArtworkByArtworkID(artworkIds: string[]): Promise<IArtworkDataJSON[]> {
    try {
      // For some reason this query doesn't match the user ID exactly, so check if user Id contains user Id
      const result: any = await this.db.collection("artworks").find(
        { "_id": { $regex: ".*" + artworkIds + ".*" } })
        .toArray();
      if (!result) {
        return [];
      }

      return result as IArtworkDataJSON[];
    } catch (err) {
      err.message = "Database error";
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
