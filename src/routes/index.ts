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
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router, artworkHandler: ArtworkHandler) {
    // log
    console.log("[IndexRoute::create] Creating index route.");

    // add home page route
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
   * The home page route.
   *
   * @class IndexRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public async index(req: Request, res: Response, next: NextFunction, artworkHandler: ArtworkHandler) {
    if (req.session!.user) { // If user logged in
      const artworks: IArtworkDataJSON[] = await artworkHandler.findArtworkForUser(req, res, next);
      const artworkDTOs: ArtworkDTO[] = artworks.map((artwork) => new ArtworkDTO(artwork));
      console.log("index route: artworks near user:" + artworkDTOs);
      const tmpArtworkDTO: any[] = artworkDTOs.map((a) => { return {
        "artID": a._id,
        "url": a.photos[0]
      }; } );
      console.log(tmpArtworkDTO);
      this.render(req, res, "home", {
        name: req.session!.user.name,
        username: req.session!.user.username,
        // artwork: [ // This is temporary to develop the carousel
        //  { artID: 1, url: "../assets/tempforcarousel/1.jpg" },
        //  { artID: 2, url: "../assets/tempforcarousel/2.jpg" },
        //  { artID: 3, url: "../assets/tempforcarousel/3.jpg" },
        //  { artID: 4, url: "../assets/tempforcarousel/4.jpg" },
        //  { artID: 5, url: "../assets/tempforcarousel/5.jpg" },
        //  { artID: 6, url: "../assets/tempforcarousel/6.jpg" },
        //  { artID: 7, url: "../assets/tempforcarousel/7.jpg" },
        //  { artID: 8, url: "../assets/tempforcarousel/8.jpg" },
        //  { artID: 9, url: "../assets/tempforcarousel/9.jpg" },
        //  { artID: 10, url: "../assets/tempforcarousel/10.jpg" }
        // ]
        artwork: tmpArtworkDTO
      });
    } else {
      this.render(req, res, "index");
    }
  }
}
