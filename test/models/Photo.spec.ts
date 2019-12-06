import { expect } from "chai";
import "mocha";
import { Photo } from "../../src/models/Photo";
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";

describe("Photo object", () => {
  const photoData = {
    userId: "fdjk39fdkfds0ffdss"
  };
  const invalidData = {
    id: "fdjk39fdkfds0ffdss"
  };
  const invalidDataEmpty = {
    userId: ""
  };
  it("should create a photo object given valid data", () => {
    const photo: Photo = new Photo(photoData);

    expect(photo.getUserId()).to.equal(photoData.userId);
  });
  it("should give validation error with missing userId", () => {
    const photo: Photo = new Photo(invalidData);

    try {
      const validator: Validator = new Validator();
      const errors: ValidationErrorInterface[] = validator.validate(photo);
    } catch (error) {
      expect(error instanceof TypeError).to.equal(true);
    }
  });
  it("should give validation error with empty id", () => {
    const photo: Photo = new Photo(invalidDataEmpty);

    const validator: Validator = new Validator();
    const errors: ValidationErrorInterface[] = validator.validate(photo);

    expect(errors.length === 1);
    expect(errors[0].property === "userId");
  });
});
