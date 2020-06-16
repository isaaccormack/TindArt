import { NextFunction, Request, Response, Router } from "express";

import { BaseRoute } from "./route";
import { RegisterHandler } from "../handlers/register";

/**
 * /register route
 * /api/register api endpoint
 *
 * @class RegisterRoute
 */
export class RegisterRoute extends BaseRoute {

  /**
   * Create the routes and endpoints.
   *
   * @class RegisterRoute
   * @method create
   * @static
   */
  public static create(router: Router, registerHandler: RegisterHandler) {
    router.get("/register", (req: Request, res: Response, next: NextFunction) => {
      new RegisterRoute().register(req, res, next);
    });

    router.post("/api/register", (req: Request, res: Response, next: NextFunction) => {
      if (req.session!.user) {
        return res.redirect("/");
      }

      registerHandler.createUser(req, res, next);
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
   * The user registration page.
   *
   * @class RegisterRoute
   * @method register
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @param next {NextFunction} Execute the next method.
   */
  public register(req: Request, res: Response, next: NextFunction) {
    if (req.session!.user) {
      return res.redirect("/");
    }

    this.render(req, res, "register");
  }
}
