import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";

import { addArtworkLike, removeArtworkLike, findAllLikes, findNextLikes } from "../services/likes";
import { findPhotosById } from "../services/photo";
import { PhotoDataJSON, PhotoDTO } from "../DTOs/PhotoDTO";
import { LikeDataJSON } from "../DTOs/LikeDTO";

export async function likeArtwork(req: Request, res: Response, next: NextFunction) {
  const userId: string = req.session!.user;
  const artworkId: string = req.body.photoIdId;

  try {
    await addArtworkLike(userId, artworkId);
    // TODO: what to do in this case? flash success of some sort? -> depends on frontend
  } catch (err) {
    console.error(err);
    req.flash("serverError", "We couldn't like that photo right now");
    return res.status(500).redirect("back");
  }
}

export async function unlikeArtwork(req: Request, res: Response, next: NextFunction) {
  const userId: string = req.session!.user;
  const artworkId: string = req.body.photoId;

  try {
    await removeArtworkLike(userId, artworkId);
    // TODO: what to do in this case? flash success of some sort? -> depends on frontend
  } catch (err) {
    console.error(err);
    req.flash("serverError", "We couldn't unlike that photo right now");
    return res.status(500).redirect("back");
  }
}

/**
 * Get all of the current user's liked photos.
 * @param req express request object
 * @param res express response object
 * @param next express callback
 */
export async function getAllLikes(req: Request, res: Response, next: NextFunction): Promise<PhotoDTO[]> {
  const userId: string = req.session!.user;

  try {
    const results: LikeDataJSON[] = await findAllLikes(userId);
    console.log("successfully found all likes:" + results.map((like) => like.photoId));
    return await findPhotosById(results.map((like) => like.photoId));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Get more likes in a paginated likes view. Not yet implemented.
 * @param req express request object
 * @param res express response object
 * @param next express callback
 */
export async function getMoreLikes(req: Request, res: Response, next: NextFunction): Promise<PhotoDTO[]> {
  const userId: string = req.session!.user;
  const numToSkip: number = req.body.likesSeen ? req.body.likesSeen : 0;

  try {
    const results: LikeDataJSON[] = await findNextLikes(userId, numToSkip);
    return await findPhotosById(results.map((like) => like.photoId));
  } catch (err) {
    console.error(err);
    throw err;
  }
}
