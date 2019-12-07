import { NextFunction, Request, Response, Router } from "express";

import { BaseRoute } from "./route";
import { UserHandler } from "../handlers/users";
import { ArtworkHandler } from "../handlers/artwork";
import { UserDTO } from "../DTOs/UserDTO";
import { IUserDataJSON } from "../services/IUserService";
import { IArtworkDataJSON } from "../services/IArtworkService";
import { ArtworkDTO } from "../DTOs/ArtworkDTO";

/**
 * /user and /user/:username routes
 * /api/user/updateBio and /api/user/updatePhoneNumber api endpoints
 *
 * @class UserRoute
 */
export class UserRoute extends BaseRoute {

  /**
   * Create the routes and endpoints.
   *
   * @class UserRoute
   * @method create
   * @static
   */
  public static create(router: Router, userHandler: UserHandler, artworkHandler: ArtworkHandler) {
    console.log("[UserRoute::create] Creating user route.");

    // Staticly defined route to access auth-user page, used by partials on UI
    router.get("/user", (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }

      return res.redirect("/user/" + req.session!.user.username);
    });

    // Dynamically defined route to get a specific user's page; used by search function
    router.get("/user/:username", (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().userPage(req, res, userHandler, artworkHandler, next);
    });

    router.post("/api/user/updateBio", (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }

      userHandler.updateBio(req, res, next);
    });

    router.post("/api/user/updatePhoneNumber", (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
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
   * The user's account page.
   *
   * @class UserRoute
   * @method userPage
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @param next {NextFunction} Execute the next method.
   */
  public async userPage(req: Request, res: Response, userHandler: UserHandler,
                        artworkHandler: ArtworkHandler, next: NextFunction) {
    if (!req.session!.user) {
      return res.status(401).redirect("/");
    }

    // Try to get user page from user's request
    try {
      const userResult: IUserDataJSON = await userHandler.getUserByUsername(req, res, next);
      const userDTO: UserDTO = new UserDTO(userResult);
      const artworkResults: IArtworkDataJSON[] = await artworkHandler.findUserArtwork(req, res, next);
      // Add the URL of each result to the photoURLs array in the userDTO
      artworkResults.forEach((artworkResult) => {
        const artworkDTO: ArtworkDTO = new ArtworkDTO(artworkResult);
        artworkDTO.photos.forEach((photo) => {
          userDTO.photoURLs.push(photo);
        });
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
