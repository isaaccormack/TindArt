import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { ArtworkHandler } from "../handlers/artwork";
import { UploadHandler } from "../handlers/upload";

export class ArtworkRoute extends BaseRoute {
  public static create(router: Router, artworkHandler: ArtworkHandler, uploadHandler: UploadHandler) {
    console.log("[UploadRoute::create] Creating UploadRoutes route.");

    router.get("/api/artwork", async (req: Request, res: Response, next: NextFunction) => {
      const data = await artworkHandler.getAllArtwork(req, res, next);
      res.json(data); // should check users level of authentication here
    });
    router.get("/api/artwork/clear", async (req: Request, res: Response, next: NextFunction) => {
      artworkHandler.clearArtwork(req, res, next);
      res.json({}); // should check users level of authentication here
    });

    router.post("/api/artwork", async (req: Request, res: Response, next: NextFunction) => {
      console.log("Upload Artwork");
      if (!req.session!.user) {
        return res.redirect(401, "/");
      }
      next();
    }, (req: Request, res: Response, next: NextFunction) => {
      console.log("UploadPhoto");
      uploadHandler.uploadPhoto(req, res, next);
    }, (req: Request, res: Response, next: NextFunction) => {
      console.log("Add New Artwork");
      artworkHandler.addNewArtwork(req, res, next);
    });
  }

  /**
   * The upload page route.
   *
   * @class UploadRoute
   * @method upload
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public upload(req: Request, res: Response, next: NextFunction) {
    if (!req.session!.user) {
      return res.status(401).redirect("/");
    }

    this.render(req, res, "upload");
  }
}
