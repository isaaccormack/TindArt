import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { getUserByUsername, updateUserBio } from "../handlers/likes";
import { PhotoDataJSON, PhotoDTO } from "../DTOs/PhotoDTO";


/**
 * /likes route
 *
 * @class LikesRoute
 */
export class LikesRoute extends BaseRoute {
  public static create(router: Router) {
    console.log("[LikesRoute::create] Creating likes route.");

    router.get("/likes", (req: Request, res: Response, next: NextFunction) => {
      new LikesRoute().likesPage(req, res, next);
    });

  }

  /**
   * Constructor
   *
   * @class LikesRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The likes page route.
   *
   * @class LikesRoute
   * @method likesPage
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public async likesPage(req: Request, res: Response, next: NextFunction) {
    if (!req.session!.user) return res.redirect("/");

    // Try to get likes page from user's request
    try {
      //TODO: get some liked photos
      const result: PhotoDataJSON = await getLikesByUsername(req, res, next)

      const photoDTO: PhotoDTO = new PhotoDTO(result);

      this.render(req, res, "likes-page", photoDTO);
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We can't show you your liked artwork right now");
      return res.status(500).render('error');
    }
  }

  /**
   * Get another page's worth of liked artwork
   */
}
