import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

/**
 * / route
 *
 * @class LogoutRoute
 */
export class LogoutRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class LogoutRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    // log
    console.log("[LogoutRoute::create] Creating logout route.");

    // add home page route
    router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
      if (req.session!.user) {
        res.clearCookie("user_sid");
      }
      new LogoutRoute().logout(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class LogoutRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The logout route.
   *
   * @class LogoutRoute
   * @method logout
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public logout(req: Request, res: Response, next: NextFunction) {
    // set custom title
    this.title = "You have been logged out!";

    // render template
    this.render(req, res, "logout");
  }
}
