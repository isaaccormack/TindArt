import { ILikeDataJSON, ILikeService } from "./../services/ILikeService";
import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";
import { IArtworkDataJSON, IArtworkResult, IArtworkService } from "../services/IArtworkService";
import { IUserResult, IUserService } from "../services/IUserService";
import { Artwork } from "../models/Artwork";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";

export class ArtworkHandler {
  private artworkService: IArtworkService;
  private userService: IUserService;
  private likeService: ILikeService;

  constructor(artworkService: IArtworkService, userService: IUserService, likeService: ILikeService) {
    this.artworkService = artworkService;
    this.userService = userService;
    this.likeService = likeService;
  }

  /**
   * Find a user's artwork. User is specified in the parameters of the request.
   */
  public async findUserArtwork(req: Request, res: Response, next: NextFunction): Promise<IArtworkDataJSON[]> {
    const userRes: IUserResult = await this.userService.findOneUserByAttr("username", req.params.username);
    if (userRes.err) {
      throw new Error("User not found");
    }

    return await this.artworkService.findArtworkByUserID(userRes.result!._id);
  }

  /**
   * Find artwork for the logged-in user.
   */
  public async findArtworkForUser(req: Request, res: Response, next: NextFunction): Promise<IArtworkDataJSON[]> {
<<<<<<< HEAD
    return await this.artworkService.findArtworkByLocation(req.session!.user.city, req.session!.user.province);
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

    let result = await this.artworkService.getArtworkPage(ArtworkHandler.PAGE_SIZE,
      lastId, req.session!.user.city, req.session!.user.province);
    if (result[0].length === 0 && lastId.length !== 0) {
      // Hit the end of the artwork pagination, go back to the beginning
      result = await this.artworkService.getArtworkPage(ArtworkHandler.PAGE_SIZE,
        "", req.session!.user.city, req.session!.user.province);
    }
    req.session!.lastId = result[1];
    return result[0].map((r) => new ArtworkDTO(r));
  }

  /**
   * All artwork
   */
  public clearArtwork(req: Request, res: Response, next: NextFunction) {
    this.artworkService.clearArtwork();
=======
    const likes: ILikeDataJSON[] = await this.likeService.findAllLikesOrDislikes(req.session!.user._id);
    const artworks: IArtworkDataJSON[] = await this.artworkService.findArtworkByUserID(req.session!.user._id);
    const excludeLikes: string[] = likes.map((like) => like.artworkId);
    const excludeArtworks: string[] = artworks.map((artwork) => artwork._id);
    const excludeIds: string[] = excludeLikes.concat(excludeArtworks);
    return await this.artworkService.findArtworkByLocation(req.session!.user.city, req.session!.user.province, excludeIds);
>>>>>>> 9f34626f56cf37c557704f6085b5b2ec8ff19928
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
        return res.redirect("/uploadPhoto");
      }
    } catch (err) {
      console.error(err);
      req.flash("serverError", "We could not add your artwork at the moment");
      return res.status(500).render("error");
    }

    req.flash("artworkSuccess", "Artwork successfully uploaded");
    return res.redirect("/user");
  }

  /**
   * Render Artwork Validation Errors Util
   */
  private registerArtworkErrorRes(req: Request, res: Response, errors: ValidationErrorInterface[]) {
    // Grab the first error to display to users in the list of errors
    errors.forEach((error: ValidationErrorInterface) => {
      switch (error.property) {
        case "title":
          req.flash("titleError", error.errorMessage);
          break;
        case "description":
          req.flash("descriptionError", error.errorMessage);
          break;
        case "price":
          req.flash("priceError", "Please enter a valid price");
          break;
        case "depth":
          req.flash("depthError", "Please enter a valid depth");
          break;
        case "width":
          req.flash("widthError", "Please enter a valid width");
          break;
        case "height":
          req.flash("heightError", "Please enter a valid height");
          break;
      }
    });

    return res.redirect("/uploadPhoto");
  }
}
