import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { loginUser } from '../handlers/loginHandler';


/**
 * / route
 *
 * @class LoginRoute
 */
export class LoginRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class LoginRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[LoginRoute::create] Creating login route.");

    //add home page route
    router.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
      loginUser(req, res, next);
    });
  }
}