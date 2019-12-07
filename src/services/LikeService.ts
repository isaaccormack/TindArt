import { ObjectId } from "mongodb";

import { ILikeService } from "./ILikeService";
import { DBService } from "./DBService";
import { ILikeDataJSON } from "../services/ILikeService";

/**
 * TODO: comments
 * TODO: unified error handling
 */
export class LikeService extends DBService implements ILikeService {

  public async likeArtwork(userId: string, artworkId: string): Promise<void> {
    if (!userId || !artworkId) {
      // TODO: error gracefully. This case occurs when artworkId is null, which
      // occurs if the request is invalid when it is sent, which occurs in chrome
      // sometimes. Ignoring it (i.e. making it do nothing to the DB) seems like
      // a reasonable choice for now.
      return;
    }
    try {
      await this.db.collection("likes").replaceOne({
        userId,
        artworkId,
      }, {
        userId,
        artworkId,
        isLike: true,
      }, {
        upsert: true
      });
    } catch (err) {
      err.message = "Database insert error on adding like";
      throw err;
    }
  }

  public async dislikeArtwork(userId: string, artworkId: string): Promise<void> {
    if (!userId || !artworkId) {
      return;
    }
    try {
      await this.db.collection("likes").replaceOne({
        userId,
        artworkId,
      }, {
        userId,
        artworkId,
        isLike: false,
      }, {
        upsert: true
      });
    } catch (err) {
      err.message = "Database delete error on removing like";
      throw err;
    }
  }

  public async findAllLikes(userId: string): Promise<ILikeDataJSON[]> {
    if (!userId) {
      return [];
    }
    try {
      return await this.db.collection("likes").find({
        userId,
        isLike: true,
      }).toArray() as ILikeDataJSON[];
    } catch (err) {
      err.message = "Database find error on getting all likes";
      throw err;
    }
  }
}
