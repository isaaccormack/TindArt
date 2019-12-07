import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";

import { ILikeDataJSON, ILikeService } from "./../services/ILikeService";
import { IArtworkDataJSON, IArtworkService } from "./../services/IArtworkService";
import { ArtworkDTO } from "./../DTOs/ArtworkDTO";
import { LikeDTO } from "../DTOs/LikeDTO";

/**
 * TODO: Unify success handling and next() calls in coordination with the frontend.
 */
export class LikesHandler {
  private likeService: ILikeService;
  private artworkService: IArtworkService;

  constructor(likeService: ILikeService, artworkService: IArtworkService) {
    this.likeService = likeService;
    this.artworkService = artworkService;
  }

  public async likeArtwork(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.session!.user._id;
    const artworkId: string = req.body.artworkId;

    try {
      await this.likeService.likeArtwork(userId, artworkId);
      next();
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We couldn't like that artwork right now");
      res.status(500).redirect("back");
    }
  }

  public async dislikeArtwork(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: string = req.session!.user._id;
    const artworkId: string = req.body.artworkId;

    try {
      await this.likeService.dislikeArtwork(userId, artworkId);
      next();
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We couldn't dislike that artwork right now");
      res.status(500).redirect("back");
    }
  }

  /**
   * Get all of the current user's liked artworks.
   * @param req express request object
   * @param res express response object
   * @param next express callback
   */
  public async getAllLikes(req: Request, res: Response, next: NextFunction): Promise<ArtworkDTO[]> {
    const userId: string = req.session!.user._id;

    try {
      const likes: ILikeDataJSON[] = await this.likeService.findAllLikes(userId);
      const artworkIds: string[] = likes.map((like) => like.artworkId);
      const artworks: IArtworkDataJSON[] = await this.artworkService.findArtworkByArtworkID(artworkIds);
      return artworks.map((artwork) => new ArtworkDTO(artwork));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
