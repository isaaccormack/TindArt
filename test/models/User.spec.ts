import { expect } from "chai";
import "mocha";
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";
import { User } from "../../src/models/User";

describe("User object", () => {
    const userData = {
        name: "Joe",
        username: "Joe.Schmoe",
        email: "joe@gmail.com",
        city: "Kelowna",
        provinceCode: "59",
        // tslint:disable-next-line: no-hardcoded-credentials
        password: "myPassword123*"
    };

    const nonAlphaNameUserData = { ...userData };
    nonAlphaNameUserData.name = "Jo1";

    const nonRegexUserNameUserData = { ...userData };
    nonRegexUserNameUserData.username = "Joe__Schmoe";

    const nonValidEmailUserData = { ...userData };
    nonValidEmailUserData.email = "this_is_not_an_email@";

    const nonAlphaCityUserData = { ...userData };
    nonAlphaCityUserData.city = "myNumericCity1";

    // Province code 100 does not exist in list of valid province codes
    const nonExistantProvinceCodeUserData = { ...userData };
    nonExistantProvinceCodeUserData.provinceCode = "100";

    const tooLongPasswordUserData = { ...userData };
    tooLongPasswordUserData.password = "thisIsMyTooLongPassword1234567890!@#$%^&*()";

    it("should create a user object given valid data", () => {
        const user: User = new User(userData);

        expect(user.getName()).to.equal(userData.name);
        expect(user.getUsername()).to.equal(userData.username);
        expect(user.getEmail()).to.equal(userData.email);
        expect(user.getCity()).to.equal(userData.city);
        expect(user.getProvinceCode()).to.equal(userData.provinceCode);
        expect(user.getProvince()).to.equal("British Columbia");
    });
    it("should validate with no errors given valid data", () => {
        const user: User = new User(userData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length === 0);
    });
    it("should give validation error with non-alpha name", () => {
        const user: User = new User(userData);
        user.create(nonAlphaNameUserData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length === 1);
        expect(errors[0].property === "name");
    });
    it("should give validation error with non-regex matching username", () => {
        const user: User = new User(userData);
        user.create(nonRegexUserNameUserData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length === 1);
        expect(errors[0].property === "username");
    });
    it("should give validation error with imvalid email", () => {
        const user: User = new User(userData);
        user.create(nonValidEmailUserData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length === 1);
        expect(errors[0].property === "email");
    });
    it("should give validation error with non-alpha city", () => {
        const user: User = new User(userData);
        user.create(nonAlphaCityUserData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length === 1);
        expect(errors[0].property === "city");
    });
    it("should give validation error with non-existant province code", () => {
        const user: User = new User(userData);
        user.create(nonExistantProvinceCodeUserData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length === 1);
        expect(errors[0].property === "provinceCode");
    });
    it("should give validation error with password which is too long", () => {
        const user: User = new User(userData);
        user.create(tooLongPasswordUserData);

        const validator: Validator = new Validator();
        const errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length === 1);
        expect(errors[0].property === "password");
    });
});
