import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { ArtworkHandler } from "../handlers/artwork";
import { UploadHandler } from "../handlers/upload";

/**
 * /api/artwork api endpoint
 *
 * @class UploadRoute
 */
export class ArtworkRoute extends BaseRoute {

  /**
   * Create the routes and endpoints.
   *
   * @class ArtworkRoute
   * @method create
   * @static
   */
  public static create(router: Router, artworkHandler: ArtworkHandler, uploadHandler: UploadHandler) {
    router.post("/api/artwork", async (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }
      next();
    }, (req: Request, res: Response, next: NextFunction) => {
      uploadHandler.uploadPhoto(req, res, next);
    }, (req: Request, res: Response, next: NextFunction) => {
      artworkHandler.addNewArtwork(req, res, next);
    });
  }
}
