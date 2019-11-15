import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { createUser } from "../handlers/register";

/**
 * / route
 *
 * @class RegisterRoute
 */
export class RegisterRoute extends BaseRoute {
  public static create(router: Router) {
    console.log("[RegisterRoute::create] Creating register route.");

    router.get("/register", (req: Request, res: Response, next: NextFunction) => {
      new RegisterRoute().register(req, res, next);
    });

    router.post("/api/register", (req: Request, res: Response, next: NextFunction) => {
      if (req.session!.user) {
        return res.redirect("/");
      }

      createUser(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class RegisterRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The register page route.
   *
   * @class RegisterRoute
   * @method register
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public register(req: Request, res: Response, next: NextFunction) {
    if (req.session!.user) {
      return res.redirect("/");
    }

    this.render(req, res, "register");
  }
}
