import { BaseRoute } from "./route";
import { Router, Request, Response, NextFunction } from 'express';
import { getAllUsers, createUser } from '../handlers/registerHandler';

export class RegisterRouter extends BaseRoute {
  public static create(router: Router) {
    //log
    console.log("[RegisterRoute::create] Creating RegisterRoutes route.");

    //add home page route
    router.get("/register", (req: Request, res: Response, next: NextFunction) => {
      // new RegisterRouter().register(req, res, next);
      new RegisterRouter().register(req, res, next);
    });

    //add home page route
    router.get("/api/register/users", (req: Request, res: Response, next: NextFunction) => {
      // dont know how to render register page with errors that the below function yields
      getAllUsers(req, res, next);
    });

    //add home page route
    router.post("/api/register", (req: Request, res: Response, next: NextFunction) => {
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
    var options = {

    }
    this.render(req, res, "register", options);
  }
}