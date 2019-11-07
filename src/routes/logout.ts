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
    router.get("/api/logout", (req: Request, res: Response, next: NextFunction) => {
      if (req.session!.user) res.clearCookie("user_sid");

      res.redirect("/");
    });
  }
}