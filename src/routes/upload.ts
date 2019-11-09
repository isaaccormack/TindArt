import { BaseRoute } from "./route";
import { Router, Request, Response, NextFunction } from 'express';
import { getAllPhotos, uploadPhoto } from '../handlers/uploadHandler';

export class UploadRouter extends BaseRoute {
  public static create(router: Router) {
    console.log("[UploadRoute::create] Creating UploadRoutes route.");

    router.get("/api/photos", (req: Request, res: Response, next: NextFunction) => {
      getAllPhotos(req, res, next); // should check users level of authentication here
    });

    router.get("/upload", (req: Request, res: Response, next: NextFunction) => {
      new UploadRouter().upload(req, res, next);
    });

    router.post("/api/upload", (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) return res.status(401).redirect("/");

      uploadPhoto(req, res, next);
    }, (req: Request, res: Response, next: NextFunction) => {
      console.log('Test');
      console.log(req.files);
      if ('avatar' in req.files) {
        console.log(req.files.avatar[0].filename);
        req.flash('result', 'Successfully uploaded avatar');
        // Submit request to db to set users profile picture
      } else if ('gallery' in req.files) {
        req.flash('result', 'Successfully uploaded to gallery');
      }
      res.redirect('/upload');
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
    if (!req.session!.user) return res.status(401).redirect("/");

    this.render(req, res, "upload");
  }
}