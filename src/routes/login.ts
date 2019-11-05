import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { loginUser } from "../handlers/loginHandler";

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
    // login page
    router.get("/login", (req: Request, res: Response, next: NextFunction) => {
      new LoginRoute().login(req, res, next);
    });
    // add home page route
    router.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
      loginUser(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The home page route.
   *
   * @class IndexRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public login(req: Request, res: Response, next: NextFunction) {
    // set custom title
    this.title = "Welcome to TindArt";

    if (req.session!.user) {
      return res.redirect("/");
    }

    // render template
    this.render(req, res, "login");
  }
}
