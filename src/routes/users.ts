import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { UserHandler } from "../handlers/users";
import { PhotoDTO } from "../DTOs/PhotoDTO";
import { UserDTO } from "../DTOs/UserDTO";
import { PhotoService } from "../services/PhotoService";
import { IUserDataJSON } from "../services/IUserService";
import { IPhotoService, IPhotoDataJSON } from "../services/IPhotoService";

/**
 * / route
 *
 * @class UserRoute
 */
export class UserRoute extends BaseRoute {
  public static create(router: Router, userHandler: UserHandler, photoService: IPhotoService) {
    console.log("[UserRoute::create] Creating user route.");

    router.get("/user/:username", (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().userPage(req, res, userHandler, photoService, next);
    });

    router.post("/api/user/updateBio", (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.redirect("/");
      }

      userHandler.updateBio(req, res, next);
    });

    router.post("/api/user/updatePhoneNumber", (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.redirect("/");
      }

      userHandler.updatePhoneNumber(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class UserRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The user page route.
   *
   * @class UserRoute
   * @method userPage
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  // tslint:disable-next-line: max-line-length
  public async userPage(req: Request, res: Response, userHandler: UserHandler, photoService: IPhotoService, next: NextFunction) {
    if (!req.session!.user) {
      return res.redirect("/");
    }

    // Try to get user page from user's request
    try {
      const userResult: IUserDataJSON = await userHandler.getUserByUsername(req, res, next);
      const userDTO: UserDTO = new UserDTO(userResult);
      const photoResults: IPhotoDataJSON[] = await photoService.findUserPhotosByID(userDTO._id);

      // Add the URL of each result to the photoURLs array in the userDTO
      photoResults.forEach((photoResult) => {
        const photoDTO: PhotoDTO = new PhotoDTO(photoResult);
        userDTO.photoURLs.push(photoDTO.url);
      });

      if (req.session!.user.username === req.params.username) {
        this.render(req, res, "authenticated-user-page", userDTO);
      } else {
        this.render(req, res, "user-page", userDTO);
      }
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We couldn't find that account right now");
      return res.status(500).render("error");
    }
  }
}
