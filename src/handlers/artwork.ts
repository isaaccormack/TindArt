import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";
import axios from "axios";
import { IArtworkDataJSON, IArtworkResult, IArtworkService } from "../services/IArtworkService";
import { Artwork } from "../models/Artwork";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";
import { ArtworkDTO } from "../DTOs/ArtworkDTO";

const artworkNotFoundString: string = "Could not find artwork";

export class ArtworkHandler {
  private static PAGE_SIZE: number = 10;
  private artworkService: IArtworkService;

  constructor(artworkService: IArtworkService) {
    this.artworkService = artworkService;
   }

   /**
    * Find the current users artwork
    */
   public async findUserArtwork(req: Request, res: Response, next: NextFunction): Promise<IArtworkDataJSON[]> {
     return  await this.artworkService.findArtworkByUserID(req.session!.user._id);
   }

   /**
    * Find artwork for the current users location
    */
   public async findArtworkForUser(req: Request, res: Response, next: NextFunction): Promise<IArtworkDataJSON[]> {
    return  await this.artworkService.findArtworkByLocation(req.session!.user.city, req.session!.user.province);
  }

   /**
    * All artwork
    */
   public async getAllArtwork(req: Request, res: Response, next: NextFunction): Promise<IArtworkDataJSON[]> {
    return await this.artworkService.getAllArtwork();
  }

  /**
   * Get a page of artwork based on the last request
   */
  public async getArtworkPage(req: Request, res: Response, next: NextFunction) {
      let lastId = "";
      if (req.session!.lastId) {
        lastId = req.session!.lastId;
      }

      // tslint:disable-next-line:max-line-length
      let result = await this.artworkService.getArtworkPage(ArtworkHandler.PAGE_SIZE, lastId, req.session!.user.city, req.session!.user.province);
      if (result[0].length === 0 && lastId.length !== 0) {
        // Hit the end of the artwork pagination, go back to the beginning
        // tslint:disable-next-line:max-line-length
        result = await this.artworkService.getArtworkPage(ArtworkHandler.PAGE_SIZE, "", req.session!.user.city, req.session!.user.province);
      }
      req.session!.lastId = result[1];
      return result[0].map((r) => new ArtworkDTO(r));
  }

  /**
   * All artwork
   */
  public clearArtwork(req: Request, res: Response, next: NextFunction) {
   this.artworkService.clearArtwork();
 }

  public async addNewArtwork(req: Request, res: Response, next: NextFunction) {
    // Create Artwork object to validate user input
    req.body.city = req.session!.user.city;
    req.body.province = req.session!.user.province;
    const artwork: Artwork = new Artwork(req.body);
    const validator: Validator = new Validator();
    const errors: ValidationErrorInterface[] = validator.validate(artwork);

    // Send back any validation errors
    if (errors.length > 0) {
      return this.registerArtworkErrorRes(req, res, errors);
    }

    try {
      let photos: string[] = [];
      if ("gallery" in req.files) {
        // Filter out bad uploads
        photos = req.files.gallery.filter((file) => {
          if (file.filename !== "-1") {
            return true;
          }
          req.flash("artworkError", file.originalname + " could not be uploaded");
          return false;
        }).map((file: Express.Multer.File) => file.filename);
      }

      const { err, result }: IArtworkResult =
          await this.artworkService.insertNewArtwork(artwork, photos, req.session!.user._id);
      if (err) {
        req.flash(err.type, err.message);
        return res.redirect("/upload");
      }
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We could not add your artwork at the moment");
      return res.status(500).render("error");
    }

    req.flash("artworkSuccess", "Artwork successfully uploaded");
    return res.redirect("/upload");
  }

  /**
   * Render Artwork Validation Errors Util
   */
  private registerArtworkErrorRes(req: Request, res: Response, errors: ValidationErrorInterface[]) {
    // Extract errors into their own object for ease of client side rendering
    errors.forEach((error: ValidationErrorInterface) => {
      switch (error.property) {
        case "title":
          req.flash("titleError", error.errorMessage);
          break;
        case "description":
          req.flash("descriptionError", error.errorMessage);
          break;
        case "price":
          req.flash("priceError", error.errorMessage);
          break;
          case "depth":
            req.flash("dimensionsError", error.errorMessage);
            break;
        case "width":
          req.flash("dimensionsError", error.errorMessage);
          break;
        case "height":
            req.flash("dimensionsError", error.errorMessage);
            break;
      }
    });

    return res.redirect("/upload");
  }
}
