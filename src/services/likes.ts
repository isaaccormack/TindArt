import { ObjectId, Db } from "mongodb";

import { getDb } from "../database/dbclient";
import { PhotoDataJSON } from "../DTOs/PhotoDTO";
import { ArtworkDataJSON } from "../DTOs/ArtworkDTO";
import { LikeDataJSON } from "../DTOs/LikeDTO";

export async function addArtworkLike(userId: string, artworkId: string): Promise<void> {
  const db: Db = getDb();
  try {
    // TODO: "Likes" collection should have unique index on "userId" and "artworkId"
    // i.e. db.collection("likes").createIndex({"userId":1, "artworkId":1}, {unique:true});
    await db.collection("likes").insertOne({
      userId,
      artworkId,
    });
  } catch (err) {
    if (err.code === 11000) {
      return; // Do nothing: duplicate like entry
    }
    err.message = "Database error";
    throw err;
  }
}

export async function removeArtworkLike(userId: string, artworkId: string): Promise<void> {
  const db: Db = getDb();
  try {
    await db.collection("likes").deleteMany({
      userId,
      artworkId,
    });
  } catch (err) {
    err.message = "Database error";
    throw err;
  }
}

export async function getNextLikes(userId: string, numToSkip: number): Promise<LikeDataJSON[]> {
  const db: Db = getDb();
  try {
    return await db.collection("likes").find({
      userId,
    }, {
      limit: 10,
      skip: numToSkip,
    }).toArray();
  } catch (err) {
    err.message = "Database error";
    throw err;
  }
}
