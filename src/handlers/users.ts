import { Request, Response, NextFunction } from "express";
import { Validator } from "validator.ts/Validator";

import { findUserByUsername, updateUserBioByID } from "../services/user";
import { UserDataJSON } from "../DTOs/UserDTO";


/**
 * Get User By Username
 */
/* Known defect - all req.body params must be present or server will crash */
export async function getUserByUsername(req: Request, res: Response, next: NextFunction): Promise<UserDataJSON> {
  // Validate user name
  const validator: Validator = new Validator();
  const validUsername: Boolean = validator.matches(req.params.username,
    new RegExp("^(?=.{2,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"));

  if (!validUsername) throw new Error('Couldn\'t find user account');

  const result: UserDataJSON = await findUserByUsername(req.params.username); // This throws
  if (!result) throw new Error('Couldn\'t find user account'); // No user with given username exists

  return result;
}


/**
 * Update User Bio
 */
export async function updateUserBio(req: Request, res: Response, next: NextFunction) {
  // Validate user input bio
  const bio: string = req.body.bio;
  const validator: Validator = new Validator();
  const validBio: Boolean = validator.isLength(bio, 1, 300);

  if (!validBio) {
    if (bio.length == 0) {
      req.flash("bioError", "Please enter a bio");
    } else {
      req.flash("bioError", "Bio is too long, max 300 characters");
    }
    return res.redirect("back"); // reload current page
  }

  try {
    const success: Boolean = await updateUserBioByID(req.session!.user._id, bio);
    if (!success) throw new Error('Couldn\'t find user account'); // No user with given username exists

    req.session!.user.bio = bio; // Set bio in session
  } catch (err) {
    // Reload user page with error message
    console.error(err);
    req.flash("serverError", "We couldn't update your bio right now");
    return res.status(500).redirect("back"); // Reload current page
  }
  return res.redirect("back"); // Reload current page
}
