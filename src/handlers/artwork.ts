import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";
import axios from "axios";
import { IArtworkDataJSON, IArtworkResult, IArtworkService } from "../services/IArtworkService";
import { Artwork } from "../models/Artwork";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";

const artworkNotFoundString: string = "Could not find artwork";

export class ArtworkHandler {
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
    return  await this.artworkService.getAllArtwork();
  }

  /**
   * All artwork
   */
  public clearArtwork(req: Request, res: Response, next: NextFunction) {
   this.artworkService.clearArtwork();
 }

  public async addNewArtwork(req: Request, res: Response, next: NextFunction) {
    // Create Artwork object to validate user input
    const artwork: Artwork = new Artwork(req.body);
    const validator: Validator = new Validator();
    const errors: ValidationErrorInterface[] = validator.validate(artwork);

    // Send back any validation errors
    if (errors.length > 0) {
      return this.registerArtworkErrorRes(req, res, errors);
    }

    try {
      const valid: boolean = await this.validateLocation(artwork.getCity(), artwork.getProvinceCode());
      if (!valid) {
        req.flash("locationError", "City could not be found");
        return res.redirect("/upload");
      }
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
   * Validate Location Util
   */
  private async validateLocation(city: string, provinceCode: string): Promise<boolean> {
    const url: string =
      "http://geogratis.gc.ca/services/geoname/en/geonames.json" +
      "?q=" + city + "&province=" + provinceCode + "&concise=CITY";
    try {
      const res = await axios.get(url);
      const matchingCities = res.data.items;
      // If we don't find any matching cities, or the user input city name doesn't match the name returned
      return matchingCities.length > 0 && matchingCities[0].name.toLowerCase() === city.toLowerCase();
    } catch (err) {
      err.message = "Canadian geographical database error";
      throw err;
    }
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
        case "city":
          req.flash("locationError", error.errorMessage);
          break;
        case "provinceCode":
          req.flash("locationError", error.errorMessage);
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
