import { expect } from 'chai';
import 'mocha';
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from 'validator.ts/ValidationErrorInterface';
import { User } from '../src/models/User';

describe('User object', () => {
    var userData = {
        name: "Joe",
        username: "Joe.Schmoe",
        email: "joe@gmail.com",
        city: "Kelowna",
        provinceCode: "11",
        password: "myPassword123*"
    }

    var nonAlphaNameUserData = userData;
    nonAlphaNameUserData.name = "Jo1";

    var nonRegexUserNameUserData = userData;
    nonRegexUserNameUserData.username = "Joe__Schmoe";

    var nonValidEmailUserData = userData;
    nonValidEmailUserData.email = "this_is_not_an_email@";

    var nonAlphaCityUserData = userData;
    nonAlphaCityUserData.city = "myNumericCity1";

    // Province code 100 does not exist in list of valid province codes
    var nonExistantProvinceCodeUserData = userData;
    nonExistantProvinceCodeUserData.provinceCode = "100";

    var tooLongPasswordUserData = userData;
    tooLongPasswordUserData.provinceCode = "thisIsMyTooLongPassword1234567890!@#$%^&*()";

    it('should create a user object given valid data', () => {
        var user: User = new User();
        user.create(userData);

        expect(user.getName()).to.equal(userData.name);
        expect(user.getUsername()).to.equal(userData.username);
        expect(user.getEmail()).to.equal(userData.email);
        expect(user.getCity()).to.equal(userData.city);
        expect(user.getProvinceCode()).to.equal(userData.provinceCode);
    });
    it('should validate with no errors given valid data', () => {
        var user: User = new User();
        user.create(userData);

        var validator: Validator = new Validator();
        var errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length == 0);
    });
    it('should give validation error with non-alpha name', () => {
        var user: User = new User();
        user.create(nonAlphaNameUserData);

        var validator: Validator = new Validator();
        var errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length == 1);
        expect(errors[0].property == 'name');
    });
    it('should give validation error with non-regex matching username', () => {
        var user: User = new User();
        user.create(nonRegexUserNameUserData);

        var validator: Validator = new Validator();
        var errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length == 1);
        expect(errors[0].property == 'username');
    });
    it('should give validation error with imvalid email', () => {
        var user: User = new User();
        user.create(nonValidEmailUserData);

        var validator: Validator = new Validator();
        var errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length == 1);
        expect(errors[0].property == 'email');
    });
    it('should give validation error with non-alpha city', () => {
        var user: User = new User();
        user.create(nonAlphaCityUserData);

        var validator: Validator = new Validator();
        var errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length == 1);
        expect(errors[0].property == 'city');
    });
    it('should give validation error with non-existant province code', () => {
        var user: User = new User();
        user.create(nonExistantProvinceCodeUserData);

        var validator: Validator = new Validator();
        var errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length == 1);
        expect(errors[0].property == 'provinceCode');
    });
    it('should give validation error with password which is too long', () => {
        var user: User = new User();
        user.create(tooLongPasswordUserData);

        var validator: Validator = new Validator();
        var errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length == 1);
        expect(errors[0].property == 'password');
    });
});
