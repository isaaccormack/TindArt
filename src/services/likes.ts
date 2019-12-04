import { ObjectId, Db } from "mongodb";

import { getDb } from "../database/dbclient";
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
    err.message = "Database insert error on adding like";
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
    err.message = "Database delete error on removing like";
    throw err;
  }
}

export async function findAllLikes(userId: string): Promise<LikeDataJSON[]> {
  const db: Db = getDb();
  try {
    return await db.collection("likes").find({
      userId,
    }).toArray();
  } catch (err) {
    err.message = "Database find error on getting all likes";
    throw err;
  }
}

export async function findNextLikes(userId: string, numToSkip: number): Promise<LikeDataJSON[]> {
  const db: Db = getDb();
  try {
    return await db.collection("likes").find({
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
