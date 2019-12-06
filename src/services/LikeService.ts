import { ILikeService } from "./ILikeService";
import { DBService } from "./DBService";
import { ILikeDataJSON } from "../services/ILikeService";

export class LikeService extends DBService implements ILikeService {

  // TODO: return inserted like or err. See PhotoService for similar situation.
  public async addArtworkLike(userId: string, artworkId: string): Promise<any> {
    try {
      const result = await this.db.collection("likes").insertOne({
        userId,
        artworkId,
      });
      if (result.ops.length !== 1) {
        return { err: { type: "DBError", message: "Database insert error" } };
      }
      return { result: result.ops[0] as ILikeDataJSON }; // err is falsey; typecast db return value
    } catch (err) {
      if (err.code && parseInt(err.code, 10) === 11000) {
        return; // Do nothing: duplicate like entry
      }
      err.message = "Database insert error on adding like";
      throw err;
    }
  }

  // TODO: return inserted like or err. See PhotoService for similar situation.
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
