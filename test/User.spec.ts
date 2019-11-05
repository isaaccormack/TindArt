import { expect } from 'chai';
import 'mocha';
import { Validator } from "validator.ts/Validator";
import { ValidationErrorInterface } from 'validator.ts/ValidationErrorInterface';
import { User } from '../src/models/User';

describe('User object', () => {
    var userData = {
        name: "Joe",
        email: "joe@gmail.com",
        password: "myPassword123*"
    }
    it('should create a user object given valid data', () => {
        var user: User = new User(userData)

        expect(user.getName()).to.equal(userData.name);
        expect(user.getEmail()).to.equal(userData.email);
    });
    it('should validate with no errors given valid data', () => {
        var user: User = new User(userData)
        var validator: Validator = new Validator();
        var errors: ValidationErrorInterface[] = validator.validate(user);

        expect(errors.length == 0);
    });
});
