import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { uploadPhoto, uploadToGCP } from "../handlers/upload";
import { clearPhotos, getAllPhotos } from "../services/photo";

export class UploadRoute extends BaseRoute {
  public static create(router: Router) {
    console.log("[UploadRoute::create] Creating UploadRoutes route.");

    router.get("/api/photos", async (req: Request, res: Response, next: NextFunction) => {
      const data = await getAllPhotos();
      res.json(data); // should check users level of authentication here
    });
    router.get("/api/photos/clear", async (req: Request, res: Response, next: NextFunction) => {
      const data = await clearPhotos();
      res.json(data); // should check users level of authentication here
    });

    router.get("/upload", (req: Request, res: Response, next: NextFunction) => {
      new UploadRoute().upload(req, res, next);
    });

    router.post("/api/upload", (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }
      return next();
    }, uploadPhoto,
    uploadToGCP,
    (req: Request, res: Response, next: NextFunction) => {
      if ("avatar" in req.files) {
        console.log(req.files.avatar[0].originalname);
        req.flash("avatar", "Successfully uploaded avatar");
        // Submit request to db to set users profile picture
      } else if ("gallery" in req.files) {
        req.flash("gallery", "Successfully uploaded to gallery");
      }

      res.redirect("/upload");
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
