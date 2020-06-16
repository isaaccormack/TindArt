import { NextFunction, Request, Response, Router } from "express";

import { BaseRoute } from "./route";
import { UploadHandler } from "../handlers/upload";
import { IPhotoService } from "../services/IPhotoService";

/**
 * /uploadPhoto and /uploadAvatar routes
 * /api/uploadPhoto and /api/uploadAvatar api endpoints
 *
 * @class UploadRoute
 */
export class UploadRoute extends BaseRoute {

  /**
   * Create the routes and endpoints.
   *
   * @class UploadRoute
   * @method create
   * @static
   */
  public static create(router: Router, uploadHandler: UploadHandler, photoService: IPhotoService) {
    router.get("/uploadPhoto", (req: Request, res: Response, next: NextFunction) => {
      new UploadRoute().uploadPhoto(req, res, next);
    });

    router.get("/uploadAvatar", (req: Request, res: Response, next: NextFunction) => {
      new UploadRoute().uploadAvatar(req, res, next);
    });

    /* This is just a generic upload photo endpoint, which =/= upload artwork as all it does is put a photo on the GCP*/
    router.post("/api/uploadPhoto", async (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }
      uploadHandler.uploadPhoto(req, res, next);
    }, (req: Request, res: Response, next: NextFunction) => {
      if ("gallery" in req.files) {
        req.flash("gallery", "Successfully uploaded to gallery");
      }

      res.redirect("/user");
    });

    router.post("/api/uploadAvatar", async (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }
      uploadHandler.uploadAvatar(req, res, next);
    }, (req: Request, res: Response, next: NextFunction) => {
      if ("avatar" in req.files) {
        console.log(req.files.avatar[0].originalname);
        req.flash("avatar", "Successfully uploaded avatar");
      }

      res.redirect("/uploadAvatar");
    });
  }

  /**
   * The upload photo page.
   *
   * @class UploadRoute
   * @method uploadPhoto
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @param next {NextFunction} Execute the next method.
   */
  public uploadPhoto(req: Request, res: Response, next: NextFunction) {
    if (!req.session!.user) {
      return res.status(401).redirect("/");
    }

    this.render(req, res, "upload-photo");
  }

  /**
   * The upload avatar page.
   *
   * @class UploadRoute
   * @method uploadAvatar
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @param next {NextFunction} Execute the next method.
   */
  public uploadAvatar(req: Request, res: Response, next: NextFunction) {
    if (!req.session!.user) {
      return res.status(401).redirect("/");
    }

    this.render(req, res, "upload-avatar");
  }
}
