import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { ArtworkHandler } from "../handlers/artwork";
import { UploadHandler } from "../handlers/upload";

export class ArtworkRoute extends BaseRoute {
  public static create(router: Router, artworkHandler: ArtworkHandler, uploadHandler: UploadHandler) {
    console.log("[ArtworkRoute::create] Creating ArtworkRoutes route.");

    router.get("/api/artwork", async (req: Request, res: Response, next: NextFunction) => {
      const data = await artworkHandler.getAllArtwork(req, res, next);
      res.json(data); // should check users level of authentication here
    });
    router.get("/api/artwork/next", async (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }
      const data = await artworkHandler.getArtworkPage(req, res, next);
      res.json(data); // should check users level of authentication here
    });

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
