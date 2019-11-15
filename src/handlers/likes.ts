import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";

import { addArtworkLike, removeArtworkLike, getNextLikes } from "../services/likes";
import { PhotoDataJSON } from "../DTOs/PhotoDTO";
import { ArtworkDataJSON } from "../DTOs/ArtworkDTO";
import { LikeDataJSON } from "../DTOs/LikeDTO";

export async function likeArtwork(req: Request, res: Response, next: NextFunction) {
  const userId: string = req.session!.user;
  const artworkId: string = req.body.artworkId;

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
  const artworkId: string = req.body.artworkId;

  try {
    await removeArtworkLike(userId, artworkId);
    // TODO: what to do in this case? flash success of some sort? -> depends on frontend
  } catch (err) {
    console.error(err);
    req.flash("serverError", "We couldn't unlike that photo right now");
    return res.status(500).redirect("back");
  }
}

export async function getMoreLikes(req: Request, res: Response, next: NextFunction) {
  const userId: string = req.session!.user;
  const numToSkip: number = req.body.likesSeen ? req.body.likesSeen : 0;

  try {
    const results = await getNextLikes(userId, numToSkip);
  } catch (err) {
    console.error(err);
    req.flash("serverError", "We can't load more photos right now");
    // TODO: better handling for this error case
    return res.status(500).redirect("back");
  }
}
