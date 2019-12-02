import { expect, app, chai } from "./route.spec";

describe("Register Route", () => {
  it("should have no errors navigating to register page", (done) => {
    chai.request(app).get("/register")
    .end((err, res) => {
      // tslint:disable-next-line: no-unused-expression
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
   });
  });
});
