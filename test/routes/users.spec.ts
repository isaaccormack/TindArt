import { expect, app, chai } from "./route.spec";

describe("User Route", () => {
  it("should redirect to home with unauthorized request", (done) => {
    chai.request(app).get("/user/any")
    .end((err, res) => {
      // tslint:disable-next-line: no-unused-expression
      expect(err).to.be.null;
      expect(res).to.have.status(401);
      done();
   });
  });
});
