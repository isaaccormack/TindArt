import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";

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
   * The likes page route. Gets all liked photos and displays them.
   *
   * @class LikesRoute
   * @method likesPage
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public async likesPage(req: Request, res: Response, next: NextFunction) {
    if (!req.session!.user) {
      return res.redirect("/");
    }

    // Try to get likes page from user's request
    try {
      const fakeData = {photoURLs: [
        {url: "../assets/tempforcarousel/1.jpg", artworkId: 1,
        title: "thing", desc: "desc", price: 1, dimensions: [1, 2, 3] },
        {url: "../assets/tempforcarousel/2.jpg", artworkId: 1,
        title: "thing2", desc: "desc2", price: 13, dimensions: [1, 2, 3]},
        {url: "../assets/tempforcarousel/3.jpg", artworkId: 1,
        title: "thing3", desc: "desc3", price: 14, dimensions: [1, 2, 3]}
      ]};
      this.render(req, res, "likes", fakeData);
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We can't show you your liked artwork right now");
      return res.status(500).render("error");
    }
  }
}
