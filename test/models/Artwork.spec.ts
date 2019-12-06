import { expect } from "chai";
import "mocha";
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";
import { Artwork } from "../../src/models/Artwork";

describe("Artwork object", () => {
    const artworkData = {
        _id: "my _id",
        artworkId: "my artworkId",
        title: "my title",
        description: "my description",
        price: "0.0",
        units: "my units",
        width: "1",
        height: "1",
        city: "Victoria",
        province: "British Columbia"
      };

    const invalidTitleLength = { ...artworkData };
    invalidTitleLength.title = "A";

    const invalidDescriptionLength = { ...artworkData };
    invalidDescriptionLength.description = "D";

    const invalidPriceData = { ...artworkData };
    invalidPriceData.price = "1.00005";

    const invalidUnitData = { ...artworkData };
    invalidUnitData.units = "Invalid";

    it("should create a artwork object given valid data", () => {
        const artwork: Artwork = new Artwork(artworkData);

        expect(artwork.getTitle()).to.equal(artworkData.title);
        expect(artwork.getDescription()).to.equal(artworkData.description);
        expect(artwork.getPrice()).to.equal(artworkData.price);
        expect(artwork.getUnits()).to.equal(artworkData.units);
        expect(artwork.getCity()).to.equal(artworkData.city);
        expect(artwork.getProvince()).to.equal(artworkData.province);
        expect(artwork.getDimensions()).to.eql(["1", "1", "0"]);
    });
    it("should validate with no errors given valid data", () => {
        const artwork: Artwork = new Artwork(artworkData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(artwork);

        expect(errors.length === 0);
    });
    it("should give validation error with non-alpha name", () => {
        const artwork: Artwork = new Artwork(artworkData);
        artwork.create(invalidTitleLength);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(artwork);

        expect(errors.length === 1);
        expect(errors[0].property === "title");
    });
    it("should give validation error with non-regex matching artworkname", () => {
        const artwork: Artwork = new Artwork(artworkData);
        artwork.create(invalidDescriptionLength);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(artwork);

        expect(errors.length === 1);
        expect(errors[0].property === "description");
    });
    it("should give validation error with imvalid email", () => {
        const artwork: Artwork = new Artwork(artworkData);
        artwork.create(invalidPriceData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(artwork);

        expect(errors.length === 1);
        expect(errors[0].property === "price");
    });
    it("should give validation error with non-alpha city", () => {
        const artwork: Artwork = new Artwork(artworkData);
        artwork.create(invalidUnitData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(artwork);

        expect(errors.length === 1);
        expect(errors[0].property === "units");
    });
});
