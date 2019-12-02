import { expect, app, chai } from "./route.spec";

describe("Login Route", () => {
  it("should have no errors with get /login", (done) => {
    chai.request(app).get("/login")
    .end((err, res) => {
      // tslint:disable-next-line: no-unused-expression
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
   });
  });
});
