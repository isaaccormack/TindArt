import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { getAllUsers, createUser } from "../handlers/register";

/**
 * / route
 *
 * @class RegisterRouter
 */
export class RegisterRouter extends BaseRoute {
  public static create(router: Router) {
    console.log("[RegisterRoute::create] Creating RegisterRoutes route.");

    // Endpoint for development and testing
    router.get("/api/register/users", (req: Request, res: Response, next: NextFunction) => {
      getAllUsers(req, res, next);
    });

    router.get("/register", (req: Request, res: Response, next: NextFunction) => {
      new RegisterRouter().register(req, res, next);
    });

    router.post("/api/register", (req: Request, res: Response, next: NextFunction) => {
      if (req.session!.user) return res.redirect("/");

      createUser(req, res, next);
    });
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
    if (req.session!.user) return res.redirect("/");

    this.render(req, res, "register");
  }
}
