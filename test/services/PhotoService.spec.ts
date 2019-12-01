import { expect } from "chai";
import "mocha";
import { PhotoService } from "../../src/services/PhotoService";
import { mock, instance } from "ts-mockito";
import { Db } from "mongodb";

describe("PhotoService object", () => {
  // Creating mock
  const mockedDb: Db = mock(Db);
  const db: Db = instance(mockedDb);

  it("should throw an error while initializing the service", () => {
    // tslint:disable-next-line: no-use-of-empty-return-value
    expect(() => { PhotoService.initService({}); } ).to.throw();
  });
  it("should initialize the service", () => {
    // tslint:disable-next-line: no-use-of-empty-return-value
    expect(() => { PhotoService.initService({db}); } ).to.not.throw();
  });
});
