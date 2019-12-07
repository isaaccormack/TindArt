import { NextFunction, Request, Response, Router } from "express";

import { BaseRoute } from "./route";

/**
 * any route not covered by another route
 *
 * @class NotFoundRoute
 */
export class NotFoundRoute extends BaseRoute {

  /**
   * Create the routes and endpoints.
   *
   * @class NotFoundRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    console.log("[NotFoundRoute::create] Creating not found route.");

    // Catch all requests for endpoints which are not found
    router.get("/*", (req: Request, res: Response, next: NextFunction) => {
      new NotFoundRoute().display(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class NotFoundRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The 404 page.
   *
   * @class NotFoundRoute
   * @method display
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @param next {NextFunction} Execute the next method.
   */
  public display(req: Request, res: Response, next: NextFunction) {
    if (!req.session!.user) {
      return res.redirect("/");
    }

    res.status(404);
    this.render(req, res, "404");
  }
}
