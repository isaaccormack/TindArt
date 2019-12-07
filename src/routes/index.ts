import { NextFunction, Request, Response, Router } from "express";

import { IArtworkDataJSON } from "../services/IArtworkService";
import { ArtworkHandler } from "../handlers/artwork";
import { ArtworkDTO } from "../DTOs/ArtworkDTO";
import { BaseRoute } from "./route";

/**
 * / route
 *
 * @class IndexRoute
 */
export class IndexRoute extends BaseRoute {

  /**
   * Create the routes and endpoints.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router, artworkHandler: ArtworkHandler) {
    console.log("[IndexRoute::create] Creating index route.");

    router.get("/", async (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().index(req, res, next, artworkHandler);
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
   * The home page. Renders the index page to unauthenticated users, or the browse
   * page to authenticated users.
   *
   * @class IndexRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @param next {NextFunction} Execute the next method.
   */
  public async index(req: Request, res: Response, next: NextFunction, artworkHandler: ArtworkHandler) {
    if (req.session!.user) { // If user logged in
      const artworksJSON: IArtworkDataJSON[] = await artworkHandler.findArtworkForUser(req, res, next);
      const artworksDTOs: ArtworkDTO[] = artworksJSON.map((artwork) => new ArtworkDTO(artwork));
      this.render(req, res, "home", {
        name: req.session!.user.name,
        username: req.session!.user.username,
        artwork: artworksDTOs
      });
    } else {
      this.render(req, res, "index");
    }
  }
}
