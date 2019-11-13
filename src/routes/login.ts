import { NextFunction, Request, Response, Router } from "express";

import { BaseRoute } from "./route";
import { loginUser } from "../handlers/login";

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
    // log
    console.log("[LoginRoute::create] Creating login route.");

    router.get("/login", (req: Request, res: Response, next: NextFunction) => {
      new LoginRoute().login(req, res, next);
    });

    router.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
      if (req.session!.user) return res.redirect("/");

      loginUser(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class LoginRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The login route.
   *
   * @class LoginRoute
   * @method login
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public login(req: Request, res: Response, next: NextFunction) {
    if (req.session!.user) return res.redirect("/");

    this.render(req, res, "login");
  }
}
