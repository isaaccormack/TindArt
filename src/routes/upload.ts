import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { UploadHandler } from "../handlers/upload";
import { IPhotoService } from "../services/IPhotoService";
import { UserDTO } from "../DTOs/UserDTO";

export class UploadRoute extends BaseRoute {
  public static create(router: Router, uploadHandler: UploadHandler, photoService: IPhotoService) {
    console.log("[UploadRoute::create] Creating UploadRoutes route.");

    router.get("/api/photos", async (req: Request, res: Response, next: NextFunction) => {
      const data = await photoService.getAllPhotos();
      res.json(data); // should check users level of authentication here
    });

    router.get("/api/photos/clear", async (req: Request, res: Response, next: NextFunction) => {
      photoService.clearPhotos();
      res.json({}); // should check users level of authentication here
    });

    router.get("/uploadPhoto", (req: Request, res: Response, next: NextFunction) => {
      new UploadRoute().uploadPhoto(req, res, next);
    });

    router.get("/uploadAvatar", (req: Request, res: Response, next: NextFunction) => {
      new UploadRoute().uploadAvatar(req, res, next);
    });

    // need to split this up!
    router.post("/api/upload", async (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }
      uploadHandler.uploadPhoto(req, res, next);
    }, (req: Request, res: Response, next: NextFunction) => {
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
   * The upload photo page route.
   *
   * @class UploadRoute
   * @method uploadPhoto
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public uploadPhoto(req: Request, res: Response, next: NextFunction) {
    if (!req.session!.user) {
      return res.status(401).redirect("/");
    }

    this.render(req, res, "upload-photo");
  }

  /**
   * The upload avatar page route.
   *
   * @class UploadRoute
   * @method uploadAvatar
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public uploadAvatar(req: Request, res: Response, next: NextFunction) {
    if (!req.session!.user) {
      return res.redirect(401, "/");
    }

    this.render(req, res, "upload-avatar");
  }
}
