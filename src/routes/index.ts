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
        photos: [ // This is temporary to develop the carousel
          { artworkID: 1, url: "../assets/tempforcarousel/1.jpg", title: "1", description: "desc1",
         city: "Victoria", province: "BC", dimensions: [1, 1, 1] },
          { artworkID: 2, url: "../assets/tempforcarousel/2.jpg", title: "2", description: "desc2",
          city: "Victoria", province: "BC", dimensions: [1, 1, 1] },
          { artworkID: 3, url: "../assets/tempforcarousel/3.jpg", title: "3", description: "desc23",
          city: "Victoria", province: "BC", dimensions: [1, 1, 1] },
          { artworkID: 4, url: "../assets/tempforcarousel/4.jpg", title: "4", description: "desc24",
          city: "Victoria", province: "BC", dimensions: [1, 1, 1] },
          { artworkID: 5, url: "../assets/tempforcarousel/5.jpg", title: "5", description: "desc5",
          city: "Victoria", province: "BC", dimensions: [1, 1, 1] },
          { artworkID: 6, url: "../assets/tempforcarousel/6.jpg", title: "6", description: "desc66",
          city: "Victoria", province: "BC", dimensions: [1, 1, 1] },
          { artworkID: 7, url: "../assets/tempforcarousel/7.jpg", title: "7", description: "desc7",
          city: "Victoria", province: "BC", dimensions: [1, 1, 1] },
          { artworkID: 8, url: "../assets/tempforcarousel/8.jpg", title: "8", description: "desc18",
          city: "Victoria", province: "BC", dimensions: [1, 1, 1] },
          { artworkID: 9, url: "../assets/tempforcarousel/9.jpg", title: "8", description: "desc19",
          city: "Victoria", province: "BC", dimensions: [1, 1, 1] },
          { artworkID: 10, url: "../assets/tempforcarousel/10.jpg", title: "10", description: "desc110",
          city: "Victoria", province: "BC", dimensions: [1, 1, 1] }
        ]
      });
    } else {
      this.render(req, res, "index");
    }
  }
}
