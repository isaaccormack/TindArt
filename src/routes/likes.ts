import { NextFunction, Request, Response, Router } from "express";

import { BaseRoute } from "./route";
import { ArtworkDTO } from "./../DTOs/ArtworkDTO";
import { LikesHandler } from "../handlers/likes";

/**
 * /likes route
 * /api/like and /api/dislike api endpoints
 *
 * @class LikesRoute
 */
export class LikesRoute extends BaseRoute {

  /**
   * Create the routes and endpoints.
   *
   * @class LikesRoute
   * @method create
   * @static
   */
  public static create(router: Router, likesHandler: LikesHandler) {
    router.get("/likes", (req: Request, res: Response, next: NextFunction) => {
      new LikesRoute().likesPage(req, res, next, likesHandler);
    });

    router.post("/api/like", async (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }

      likesHandler.likeArtwork(req, res, next);
      return res.sendStatus(200);
    });

    router.post("/api/dislike", async (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }

      likesHandler.dislikeArtwork(req, res, next);
      return res.sendStatus(200);
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
   * The likes page route. Gets all of the user's liked artworks and displays them.
   *
   * @class LikesRoute
   * @method likesPage
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @param next {NextFunction} Execute the next method.
   */
  public async likesPage(req: Request, res: Response, next: NextFunction, likesHandler: LikesHandler) {
    if (!req.session!.user) {
      return res.redirect("/");
    }

    try {
      const results: ArtworkDTO[] = await likesHandler.getAllLikes(req, res, next);
      this.render(req, res, "likes", { likes: results });
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We can't show you your liked artwork right now");
      return res.status(500).render("error");
    }
  }
}
