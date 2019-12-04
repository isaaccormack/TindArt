import { ILikeService } from "./ILikeService";
import { DBService } from "./DBService";
import { ObjectId } from "mongodb";

import { getDb } from "../database/dbclient";
import { IPhotoDataJSON } from "../services/IPhotoService";
import { ArtworkDataJSON } from "../DTOs/ArtworkDTO";
import { ILikeDataJSON } from "../services/ILikeService";

export class LikeService extends DBService implements ILikeService {

  public async addArtworkLike(userId: string, artworkId: string): Promise<void> {
    try {
      // TODO: "Likes" collection should have unique index on "userId" and "artworkId"
      // i.e. db.collection("likes").createIndex({"userId":1, "artworkId":1}, {unique:true});
      await this.db.collection("likes").insertOne({
        userId,
        artworkId,
      });
    } catch (err) {
      if (err.code === 11000) {
        return; // Do nothing: duplicate like entry
      }
      err.message = "Database insert error on adding like";
      throw err;
    }
  }

  public async removeArtworkLike(userId: string, artworkId: string): Promise<void> {
    try {
      await this.db.collection("likes").deleteMany({
        userId,
        artworkId,
      });
    } catch (err) {
      err.message = "Database delete error on removing like";
      throw err;
    }
  }

  public async findAllLikes(userId: string): Promise<ILikeDataJSON[]> {
    try {
      return await this.db.collection("likes").find({
        userId,
      }).toArray();
    } catch (err) {
      err.message = "Database find error on getting all likes";
      throw err;
    }
  }

  public async findNextLikes(userId: string, numToSkip: number): Promise<ILikeDataJSON[]> {
    try {
      return await this.db.collection("likes").find({
        userId,
      }, {
        limit: 10,
        skip: numToSkip,
      }).toArray();
    } catch (err) {
      err.message = "Database find error on gettting more likes";
      throw err;
    }
  }

}