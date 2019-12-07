import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";

import { IUserDataJSON, IUserResult, IUserService } from "../services/IUserService";

const userNotFoundString: string = "Couldn't find user account";

export class UserHandler {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  /**
   * Get User By Username
   */
  /* Known defect - all req.body params must be present or server will crash */
  public async getUserByUsername(req: Request, res: Response, next: NextFunction): Promise<IUserDataJSON> {
    // Validate user name
    const validator: Validator = new Validator();
    const validUsername: boolean = validator.matches(req.params.username,
      new RegExp("^(?=.{2,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"));

    if (!validUsername) {
      throw new Error(userNotFoundString);
    }
    // This throws
    const result: IUserResult = await this.userService.findOneUserByAttr("username", req.params.username);
    if (result.err) {
      throw new Error(userNotFoundString); // No user with given username exists
    }

    return result.result!;
  }

  /**
   * Update User Bio
   */
  public async updateBio(req: Request, res: Response, next: NextFunction) {
    // Validate user input bio
    const bio: string = req.body.bio;
    const validator: Validator = new Validator();
    const validBio: boolean = validator.isLength(bio, 0, 300);

    if (!validBio) {
      req.flash("bioError", "Bio is too long, max 300 characters");
      return res.redirect("back"); // reload current page
    }

    try {
      const success: boolean = await this.userService.updateUserAttrByID(req.session!.user._id, "bio", bio);
      if (!success) {
        throw new Error(userNotFoundString); // No user with given username exists
      }

      req.session!.user.bio = bio; // Set bio in session
    } catch (err) {
      // Reload user page with error message
      console.error(err);
      req.flash("serverError", "We couldn't update your bio right now");
      return res.status(500).redirect("back"); // Reload current page
    }
    return res.redirect("back"); // Reload current page
  }

  /**
   * Update User Phone Number
   */
  public async updatePhoneNumber(req: Request, res: Response, next: NextFunction) {
    // Validate user input phone number
    const phoneNumber: string = req.body.phoneNumber;

    // If the user sent a phone number, validate it
    if (phoneNumber) {
      const validator: Validator = new Validator();
      const validPhoneNumber: boolean = validator.isMobilePhone(phoneNumber, "en-US");
      if (!validPhoneNumber) {
        req.flash("phoneNumberError", "Please enter a valid phone number");
        return res.redirect("back"); // reload current page
      }
    }

    try {
      // tslint:disable-next-line: max-line-length
      const success: boolean = await this.userService.updateUserAttrByID(req.session!.user._id, "phoneNumber", phoneNumber);
      if (!success) {
        throw new Error(userNotFoundString); // No user with given username exists
      }

      req.session!.user.phoneNumber = phoneNumber; // Set phone number in session
    } catch (err) {
      // Reload user page with error message
      console.error(err);
      req.flash("serverError", "We couldn't update your phone number right now");
      return res.status(500).redirect("back"); // Reload current page
    }
    return res.redirect("back"); // Reload current page
  }
}
