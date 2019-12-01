import { expect } from "chai";
import "mocha";
import { IndexRoute } from "../../src/routes/index";
import { mock, instance, when } from "ts-mockito";
import { Router } from "express";

describe("index object", () => {
  // Creating mock
  const mockedRouter: Router = mock(Router);

  const router: Router = instance(mockedRouter);

  it("should create the index route", () => {
    // tslint:disable-next-line: no-use-of-empty-return-value
    // expect(() => { IndexRoute.create(router); } ).to.not.throw();
  });
});
