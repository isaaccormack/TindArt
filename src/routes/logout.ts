import { NextFunction, Request, Response, Router } from "express";

import { BaseRoute } from "./route";

/**
 * /api/logout api endpoint
 *
 * @class LogoutRoute
 */
export class LogoutRoute extends BaseRoute {

  /**
   * Create the routes and endpoints.
   *
   * @class LogoutRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    router.get("/api/logout", (req: Request, res: Response, next: NextFunction) => {
      if (req.session!.user) {
        res.clearCookie("user_sid");
      }

      res.redirect("/");
    });
  }
}
