import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { ArtworkHandler } from "../handlers/artwork";
import { UploadHandler } from "../handlers/upload";

export class ArtworkRoute extends BaseRoute {
  public static create(router: Router, artworkHandler: ArtworkHandler, uploadHandler: UploadHandler) {
    console.log("[ArtworkRoute::create] Creating artwork route.");

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
