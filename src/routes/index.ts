import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

/**
 * / route
 *
 * @class IndexRoute
 */
export class IndexRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    // log
    console.log("[IndexRoute::create] Creating index route.");

    // add home page route
    router.get("/", (req: Request, res: Response, next: NextFunction) => {
      if (req.session!.user) {
        console.log("You are logged in!");
        console.log(req.session!.user.name);
        console.log(req.session!.user.email);
      } else {
        console.log("Not logged in!");
      }
      new IndexRoute().index(req, res, next);
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
  public index(req: Request, res: Response, next: NextFunction) {
    if (req.session!.user) { // If user logged in
      let options: object = {
        "name": req.session!.user.name
      }
      this.render(req, res, 'home', options);
    } else {
      this.render(req, res, 'index');
    }
  }
}
