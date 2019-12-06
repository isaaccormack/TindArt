import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { ArtworkDTO } from "./../DTOs/ArtworkDTO";
import { LikesHandler } from "../handlers/likes";
import { UserDTO } from "../DTOs/UserDTO";

/**
 * /likes route
 *
 * @class LikesRoute
 */
export class LikesRoute extends BaseRoute {
  public static create(router: Router, likesHandler: LikesHandler) {
    console.log("[LikesRoute::create] Creating likes route.");

    router.get("/likes", (req: Request, res: Response, next: NextFunction) => {
      new LikesRoute().likesPage(req, res, next, likesHandler);
    });

    router.post("/api/like", async (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }

      console.log("like sent! req.body=" + req.body);
      likesHandler.likeArtwork(req, res, next);
    });

    router.post("/api/dislike", async (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.status(401).redirect("/");
      }

      likesHandler.unlikeArtwork(req, res, next);
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
   * The likes page route. Gets all liked photos and displays them.
   *
   * @class LikesRoute
   * @method likesPage
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public async likesPage(req: Request, res: Response, next: NextFunction, likesHandler: LikesHandler) {
    if (!req.session!.user) {
      return res.redirect("/");
    }

    // Try to get likes page from user's request
    try {
      const results: ArtworkDTO[] = await likesHandler.getAllLikes(req, res, next);
      const fake = {
        photos: [
          {
            url: "../assets/tempforcarousel/1.jpg", artworkId: 1,
            title: "thing", description: "desc", price: 1, dimensions: [1, 2, 3], city: "Vict", province: "BC"
          },
          {
            url: "../assets/tempforcarousel/2.jpg", artworkId: 2,
            title: "second", description: "desc2", price: 2, dimensions: [2, 3, 4], city: "Calg", province: "AB"
          }
        ]
      };
      console.log(results);
      this.render(req, res, "likes", results);
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We can't show you your liked artwork right now");
      return res.status(500).render("error");
    }
  }
}
