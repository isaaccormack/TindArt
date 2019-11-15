import { Router, Request, Response, NextFunction } from "express";

import { BaseRoute } from "./route";
import { getUserByUsername, updateUserBio } from "../handlers/users";
import { UserDataJSON, UserDTO } from "../DTOs/UserDTO";

/**
 * / route
 *
 * @class UserRoute
 */
export class UserRoute extends BaseRoute {
  public static create(router: Router) {
    console.log("[UserRoute::create] Creating user route.");

    router.get("/user/:username", (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().userPage(req, res, next);
    });

    router.post("/api/user/updateBio", (req: Request, res: Response, next: NextFunction) => {
      if (!req.session!.user) {
        return res.redirect("/");
      }

      updateUserBio(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class UserRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The user page route.
   *
   * @class UserRoute
   * @method userPage
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public async userPage(req: Request, res: Response, next: NextFunction) {
    if (!req.session!.user) {
      return res.redirect("/");
    }

    // Try to get user page from user's request
    try {
      const result: UserDataJSON = await getUserByUsername(req, res, next);

      const userDTO: UserDTO = new UserDTO(result);

      if (req.session!.user.username === req.params.username) {
        this.render(req, res, "authenticated-user-page", userDTO);
      } else {
        this.render(req, res, "user-page", userDTO);
      }
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We couldn't find that account right now");
      return res.status(500).render("error");
    }
  }
}
