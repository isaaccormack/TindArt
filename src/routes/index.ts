import { NextFunction, Request, Response, Router } from "express";

import { BaseRoute } from "./route";

/**
 * / route
 *
 * @class IndexRoute
 */
export class IndexRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    // log
    console.log("[IndexRoute::create] Creating index route.");

    // add home page route
    router.get("/", (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().index(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The home page route.
   *
   * @class IndexRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public index(req: Request, res: Response, next: NextFunction) {
    if (req.session!.user) { // If user logged in
      this.render(req, res, "home", {
        name: req.session!.user.name,
        username: req.session!.user.username,
        artwork: [ // This is temporary to develop the carousel
          { artID: 1, url: "../assets/tempforcarousel/1.jpg" },
          { artID: 2, url: "../assets/tempforcarousel/2.jpg" },
          { artID: 3, url: "../assets/tempforcarousel/3.jpg" },
          { artID: 4, url: "../assets/tempforcarousel/4.jpg" },
          { artID: 5, url: "../assets/tempforcarousel/5.jpg" },
          { artID: 6, url: "../assets/tempforcarousel/6.jpg" },
          { artID: 7, url: "../assets/tempforcarousel/7.jpg" },
          { artID: 8, url: "../assets/tempforcarousel/8.jpg" },
          { artID: 9, url: "../assets/tempforcarousel/9.jpg" },
          { artID: 10, url: "../assets/tempforcarousel/10.jpg" }
        ]
      });
    } else {
      this.render(req, res, "index");
    }
  }
}
